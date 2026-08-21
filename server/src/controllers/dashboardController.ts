import { Response } from "express";
import { prisma } from "../config/prisma";
import { ok } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";

// Dashboard — Day 13: activity feed, connection suggestions, trending posts, your stats
export async function getDashboard(req: AuthedRequest, res: Response) {
  const userId = req.user!.userId;

  const [connectionCount, endorsementCount, projectCount, postCount, pendingRequests, trendingPosts, connectedIds] =
    await Promise.all([
      prisma.connection.count({ where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] } }),
      prisma.endorsement.count({ where: { toUserId: userId } }),
      prisma.project.count({ where: { ownerId: userId } }),
      prisma.blogPost.count({ where: { authorId: userId } }),
      prisma.connection.findMany({
        where: { addresseeId: userId, status: "PENDING" },
        include: { requester: { select: { username: true, fullName: true, avatarUrl: true } } },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { author: { select: { username: true, fullName: true, avatarUrl: true } } },
      }),
      prisma.connection.findMany({
        where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
        select: { requesterId: true, addresseeId: true },
      }),
    ]);

  const connectedUserIds = new Set<string>([userId]);
  connectedIds.forEach((c: { requesterId: string; addresseeId: string }) => {
    connectedUserIds.add(c.requesterId);
    connectedUserIds.add(c.addresseeId);
  });

  const suggestions = await prisma.user.findMany({
    where: { id: { notIn: Array.from(connectedUserIds) } },
    select: { id: true, username: true, fullName: true, avatarUrl: true, location: true },
    take: 5,
  });

  return ok(
    res,
    {
      stats: { connectionCount, endorsementCount, projectCount, postCount },
      pendingRequests,
      trendingPosts,
      suggestions,
    },
    "Dashboard data fetched"
  );
}
