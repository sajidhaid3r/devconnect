import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ok, created, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";

const projectSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  techStack: z.array(z.string()).default([]),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
});

export async function listProjectsByUser(req: AuthedRequest, res: Response) {
  const { username } = req.params;
  const projects = await prisma.project.findMany({
    where: { owner: { username } },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, projects, "Projects fetched");
}

export async function createProject(req: AuthedRequest, res: Response) {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);

  let imageUrl: string | undefined;
  if (req.file) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "devconnect/projects" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file!.buffer);
    });
    imageUrl = result.secure_url;
  }

  const project = await prisma.project.create({
    data: { ...parsed.data, imageUrl, ownerId: req.user!.userId },
  });
  return created(res, project, "Project created");
}

export async function updateProject(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return fail(res, 404, "Project not found");
  if (existing.ownerId !== req.user!.userId) return fail(res, 403, "Not your project");

  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);

  const project = await prisma.project.update({ where: { id }, data: parsed.data });
  return ok(res, project, "Project updated");
}

export async function deleteProject(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return fail(res, 404, "Project not found");
  if (existing.ownerId !== req.user!.userId) return fail(res, 403, "Not your project");

  await prisma.project.delete({ where: { id } });
  return ok(res, null, "Project deleted");
}
