import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ok, created, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";
import { emitToUser } from "../socket";

const endorseSchema = z.object({ toUsername: z.string().min(1), skillName: z.string().min(1) });

// Endorsements are limited to connected developers (per PDF feature list).
export async function endorseSkill(req: AuthedRequest, res: Response) {
  const parsed = endorseSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);
  const { toUsername, skillName } = parsed.data;

  const toUser = await prisma.user.findUnique({ where: { username: toUsername } });
  if (!toUser) return fail(res, 404, "User not found");
  if (toUser.id === req.user!.userId) return fail(res, 400, "Cannot endorse yourself");

  const isConnected = await prisma.connection.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: req.user!.userId, addresseeId: toUser.id },
        { requesterId: toUser.id, addresseeId: req.user!.userId },
      ],
    },
  });
  if (!isConnected) return fail(res, 403, "You can only endorse connected developers");

  const skill = await prisma.skill.upsert({ where: { name: skillName }, update: {}, create: { name: skillName } });

  const existing = await prisma.endorsement.findUnique({
    where: { skillId_fromUserId_toUserId: { skillId: skill.id, fromUserId: req.user!.userId, toUserId: toUser.id } },
  });
  if (existing) return fail(res, 409, "Already endorsed this skill");

  const endorsement = await prisma.endorsement.create({
    data: { skillId: skill.id, fromUserId: req.user!.userId, toUserId: toUser.id },
  });

  await prisma.notification.create({
    data: { userId: toUser.id, type: "ENDORSEMENT", message: `Someone endorsed your ${skillName} skill` },
  });
  emitToUser(toUser.id, "notification", { type: "ENDORSEMENT", skillName });

  return created(res, endorsement, "Skill endorsed");
}

export async function topSkills(req: AuthedRequest, res: Response) {
  const { username } = req.params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return fail(res, 404, "User not found");

  const endorsements = await prisma.endorsement.groupBy({
    by: ["skillId"],
    where: { toUserId: user.id },
    _count: { skillId: true },
    orderBy: { _count: { skillId: "desc" } },
  });

  const skills = await Promise.all(
    endorsements.map(async (e: { skillId: string; _count: { skillId: number } }) => {
      const skill = await prisma.skill.findUnique({ where: { id: e.skillId } });
      return { skill: skill?.name, count: e._count.skillId };
    })
  );
  return ok(res, skills, "Top skills fetched");
}
