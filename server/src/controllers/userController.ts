import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ok, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";

const updateProfileSchema = z.object({
  fullName: z.string().min(1).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).optional(), // skill names
});

export async function getProfile(req: AuthedRequest, res: Response) {
  const { username } = req.params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      skills: { include: { skill: true } },
      projects: { orderBy: { createdAt: "desc" } },
      posts: { where: { published: true }, orderBy: { createdAt: "desc" } },
      _count: { select: { connectionsSent: true, connectionsReceived: true, endorsementsReceived: true } },
    },
  });
  if (!user) return fail(res, 404, "User not found");
  const { passwordHash: _omit, ...safeUser } = user;
  return ok(res, safeUser, "Profile fetched");
}

export async function updateProfile(req: AuthedRequest, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);
  const { skills, ...profileFields } = parsed.data;
  const userId = req.user!.userId;

  const user = await prisma.user.update({ where: { id: userId }, data: profileFields });

  if (skills) {
    await prisma.userSkill.deleteMany({ where: { userId } });
    for (const name of skills) {
      const skill = await prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      await prisma.userSkill.create({ data: { userId, skillId: skill.id } });
    }
  }

  const { passwordHash: _omit, ...safeUser } = user;
  return ok(res, safeUser, "Profile updated");
}

export async function uploadAvatar(req: AuthedRequest, res: Response) {
  if (!req.file) return fail(res, 400, "No image uploaded");
  const userId = req.user!.userId;

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "devconnect/avatars", transformation: [{ width: 400, height: 400, crop: "fill" }] },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(req.file!.buffer);
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: uploadResult.secure_url },
  });
  const { passwordHash: _omit, ...safeUser } = user;
  return ok(res, safeUser, "Avatar uploaded");
}

// Developer search & discovery — Day 8: filter by skills, location; paginated
export async function searchDevelopers(req: AuthedRequest, res: Response) {
  const { skill, location, page = "1", limit = "12" } = req.query as Record<string, string>;
  const take = Math.min(parseInt(limit) || 12, 50);
  const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

  const where: any = {};
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (skill) where.skills = { some: { skill: { name: { equals: skill, mode: "insensitive" } } } };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { skills: { include: { skill: true } } },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  const safeUsers = users.map((user) => {
    const { passwordHash: _omit, ...rest } = user;
    return rest;
  });
  return ok(res, { users: safeUsers, total, page: Number(page), totalPages: Math.ceil(total / take) }, "Search results");
}
