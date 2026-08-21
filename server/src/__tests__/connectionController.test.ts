import { Response } from "express";

jest.mock("../config/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn(), findMany: jest.fn() },
    connection: { findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn() },
    notification: { create: jest.fn() },
  },
}));
jest.mock("../socket", () => ({ emitToUser: jest.fn() }));

import { prisma } from "../config/prisma";
import { mutualConnections, sendRequest } from "../controllers/connectionController";
import { AuthedRequest } from "../middleware/auth";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("connectionController.mutualConnections", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns only users who are accepted connections of both people", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "bob" });

    // "me" is connected to alice, carol, dave; "bob" is connected to carol, dave, erin
    (prisma.connection.findMany as jest.Mock)
      .mockResolvedValueOnce([
        { requesterId: "me", addresseeId: "alice" },
        { requesterId: "carol", addresseeId: "me" },
        { requesterId: "me", addresseeId: "dave" },
      ])
      .mockResolvedValueOnce([
        { requesterId: "bob", addresseeId: "carol" },
        { requesterId: "bob", addresseeId: "dave" },
        { requesterId: "erin", addresseeId: "bob" },
      ]);

    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: "carol", username: "carol", fullName: "Carol", avatarUrl: null },
      { id: "dave", username: "dave", fullName: "Dave", avatarUrl: null },
    ]);

    const req = { params: { username: "bob" }, user: { userId: "me", email: "me@x.com" } } as unknown as AuthedRequest;
    const res = mockRes();

    await mutualConnections(req, res);

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: expect.arrayContaining(["carol", "dave"]) } } })
    );
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.data.map((u: any) => u.username).sort()).toEqual(["carol", "dave"]);
  });

  it("returns an empty list (not an error) when there's no overlap", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "bob" });
    (prisma.connection.findMany as jest.Mock)
      .mockResolvedValueOnce([{ requesterId: "me", addresseeId: "alice" }])
      .mockResolvedValueOnce([{ requesterId: "bob", addresseeId: "erin" }]);

    const req = { params: { username: "bob" }, user: { userId: "me", email: "me@x.com" } } as unknown as AuthedRequest;
    const res = mockRes();

    await mutualConnections(req, res);

    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });

  it("404s when the target user doesn't exist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const req = { params: { username: "ghost" }, user: { userId: "me", email: "me@x.com" } } as unknown as AuthedRequest;
    const res = mockRes();

    await mutualConnections(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("connectionController.sendRequest", () => {
  beforeEach(() => jest.clearAllMocks());

  it("blocks sending a connection request to yourself", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "me" });
    const req = {
      body: { addresseeUsername: "myself" },
      user: { userId: "me", email: "me@x.com" },
    } as unknown as AuthedRequest;
    const res = mockRes();

    await sendRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.connection.create).not.toHaveBeenCalled();
  });

  it("blocks a duplicate request with 409", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "bob" });
    (prisma.connection.findFirst as jest.Mock).mockResolvedValue({ status: "PENDING" });
    const req = {
      body: { addresseeUsername: "bob" },
      user: { userId: "me", email: "me@x.com" },
    } as unknown as AuthedRequest;
    const res = mockRes();

    await sendRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(prisma.connection.create).not.toHaveBeenCalled();
  });
});
