import { Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ok, created, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const postSchema = z.object({
  title: z.string().min(1).max(150),
  contentMarkdown: z.string().min(1),
  excerpt: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export async function listPosts(req: AuthedRequest, res: Response) {
  const { page = "1", limit = "10" } = req.query as Record<string, string>;
  const take = Math.min(parseInt(limit) || 10, 50);
  const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      include: { author: { select: { username: true, fullName: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);
  return ok(res, { posts, total, page: Number(page), totalPages: Math.ceil(total / take) }, "Posts fetched");
}

export async function getPost(req: AuthedRequest, res: Response) {
  const { slug } = req.params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { username: true, fullName: true, avatarUrl: true } } },
  });
  if (!post) return fail(res, 404, "Post not found");
  return ok(res, post, "Post fetched");
}

export async function createPost(req: AuthedRequest, res: Response) {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);
  const { title, contentMarkdown, excerpt, coverImageUrl, published } = parsed.data;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: slugify(title),
      contentMarkdown,
      excerpt: excerpt || contentMarkdown.slice(0, 180),
      coverImageUrl: coverImageUrl || undefined,
      published: published ?? false,
      authorId: req.user!.userId,
    },
  });
  return created(res, post, "Post created");
}

export async function updatePost(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return fail(res, 404, "Post not found");
  if (existing.authorId !== req.user!.userId) return fail(res, 403, "Not your post");

  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);

  const post = await prisma.blogPost.update({ where: { id }, data: parsed.data });
  return ok(res, post, "Post updated");
}

export async function deletePost(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return fail(res, 404, "Post not found");
  if (existing.authorId !== req.user!.userId) return fail(res, 403, "Not your post");

  await prisma.blogPost.delete({ where: { id } });
  return ok(res, null, "Post deleted");
}
