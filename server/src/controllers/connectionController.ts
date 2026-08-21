import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ok, created, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";
import { emitToUser } from "../socket";

const requestSchema = z.object({ addresseeUsername: z.string().min(1) });

export async function sendRequest(req: AuthedRequest, res: Response) {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);

  const addressee = await prisma.user.findUnique({ where: { username: parsed.data.addresseeUsername } });
  if (!addressee) return fail(res, 404, "User not found");
  if (addressee.id === req.user!.userId) return fail(res, 400, "Cannot connect with yourself");

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId: req.user!.userId, addresseeId: addressee.id },
        { requesterId: addressee.id, addresseeId: req.user!.userId },
      ],
    },
  });
  if (existing) return fail(res, 409, `Connection already ${existing.status.toLowerCase()}`);

  const connection = await prisma.connection.create({
    data: { requesterId: req.user!.userId, addresseeId: addressee.id, status: "PENDING" },
  });

  await prisma.notification.create({
    data: {
      userId: addressee.id,
      type: "CONNECTION_REQUEST",
      message: `You have a new connection request`,
    },
  });
  emitToUser(addressee.id, "notification", { type: "CONNECTION_REQUEST", connectionId: connection.id });

  return created(res, connection, "Connection request sent");
}

export async function respondRequest(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const { action } = req.body as { action: "ACCEPT" | "REJECT" };

  const connection = await prisma.connection.findUnique({ where: { id } });
  if (!connection) return fail(res, 404, "Connection not found");
  if (connection.addresseeId !== req.user!.userId) return fail(res, 403, "Not your request to respond to");

  const status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
  const updated = await prisma.connection.update({ where: { id }, data: { status } });

  if (status === "ACCEPTED") {
    await prisma.notification.create({
      data: { userId: connection.requesterId, type: "CONNECTION_ACCEPTED", message: "Your connection request was accepted" },
    });
    emitToUser(connection.requesterId, "notification", { type: "CONNECTION_ACCEPTED", connectionId: id });
  }

  return ok(res, updated, `Connection ${status.toLowerCase()}`);
}

export async function listConnections(req: AuthedRequest, res: Response) {
  const userId = req.user!.userId;
  const connections = await prisma.connection.findMany({
    where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
    include: {
      requester: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
      addressee: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
    },
  });
  return ok(res, connections, "Connections fetched");
}

export async function listPendingRequests(req: AuthedRequest, res: Response) {
  const requests = await prisma.connection.findMany({
    where: { addresseeId: req.user!.userId, status: "PENDING" },
    include: { requester: { select: { id: true, username: true, fullName: true, avatarUrl: true } } },
  });
  return ok(res, requests, "Pending requests fetched");
}

// Mutual connections — Day 9: "connections list, mutual connections"
// Returns developers who are accepted connections of BOTH the current user and :username.
export async function mutualConnections(req: AuthedRequest, res: Response) {
  const { username } = req.params;
  const currentUserId = req.user!.userId;

  const targetUser = await prisma.user.findUnique({ where: { username } });
  if (!targetUser) return fail(res, 404, "User not found");

  async function acceptedPeerIds(userId: string): Promise<Set<string>> {
    const rows = await prisma.connection.findMany({
      where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
      select: { requesterId: true, addresseeId: true },
    });
    return new Set(rows.map((r: { requesterId: string; addresseeId: string }) => (r.requesterId === userId ? r.addresseeId : r.requesterId)));
  }

  const [myPeers, theirPeers] = await Promise.all([
    acceptedPeerIds(currentUserId),
    acceptedPeerIds(targetUser.id),
  ]);

  const mutualIds = [...myPeers].filter((id) => theirPeers.has(id));
  if (mutualIds.length === 0) return ok(res, [], "No mutual connections");

  const mutuals = await prisma.user.findMany({
    where: { id: { in: mutualIds } },
    select: { id: true, username: true, fullName: true, avatarUrl: true },
  });
  return ok(res, mutuals, "Mutual connections fetched");
}

export async function removeConnection(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const connection = await prisma.connection.findUnique({ where: { id } });
  if (!connection) return fail(res, 404, "Connection not found");
  if (![connection.requesterId, connection.addresseeId].includes(req.user!.userId)) {
    return fail(res, 403, "Not part of this connection");
  }
  await prisma.connection.delete({ where: { id } });
  return ok(res, null, "Connection removed");
}
