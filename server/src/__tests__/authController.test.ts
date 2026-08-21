import { Response } from "express";

// Mock Prisma before importing the controller so the controller picks up the mock.
jest.mock("../config/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn(),
}));
jest.mock("../utils/jwt", () => ({
  signToken: jest.fn().mockReturnValue("fake.jwt.token"),
}));

import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import { register, login } from "../controllers/authController";
import { AuthedRequest } from "../middleware/auth";

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("authController.register", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rejects a duplicate email/username with 409", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: "existing-user" });
    const req = {
      body: { email: "a@b.com", username: "alice", password: "password123", fullName: "Alice" },
    } as AuthedRequest;
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("hashes the password and issues a cookie on success", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      username: "alice",
      fullName: "Alice",
      passwordHash: "hashed_password",
    });
    const req = {
      body: { email: "a@b.com", username: "alice", password: "password123", fullName: "Alice" },
    } as AuthedRequest;
    const res = mockRes();

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(res.cookie).toHaveBeenCalledWith("token", "fake.jwt.token", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(201);
    // passwordHash must never be echoed back to the client
    const responseBody = (res.json as jest.Mock).mock.calls[0][0];
    expect(responseBody.data.user.passwordHash).toBeUndefined();
    expect(responseBody.data.user.email).toBe("a@b.com");
  });

  it("rejects invalid input before touching the database", async () => {
    const req = { body: { email: "not-an-email", username: "a", password: "short", fullName: "" } } as AuthedRequest;
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
  });
});

describe("authController.login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 401 for a nonexistent user without revealing which field was wrong", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const req = { body: { email: "nobody@x.com", password: "password123" } } as AuthedRequest;
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when the password doesn't match", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "u1", email: "a@b.com", passwordHash: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const req = { body: { email: "a@b.com", password: "wrongpass" } } as AuthedRequest;
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("logs in successfully and sets the auth cookie", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      passwordHash: "hashed",
      username: "alice",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const req = { body: { email: "a@b.com", password: "password123" } } as AuthedRequest;
    const res = mockRes();

    await login(req, res);

    expect(res.cookie).toHaveBeenCalledWith("token", "fake.jwt.token", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
