import { Response } from "express";
import { prisma } from "../config/prisma";
import { ok, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";

export async function listNotifications(req: AuthedRequest, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return ok(res, notifications, "Notifications fetched");
}

export async function markRead(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== req.user!.userId) return fail(res, 404, "Notification not found");
  const updated = await prisma.notification.update({ where: { id }, data: { read: true } });
  return ok(res, updated, "Marked as read");
}
