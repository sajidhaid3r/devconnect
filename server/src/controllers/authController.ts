import { Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import axios from "axios";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";
import { ok, created, fail } from "../utils/apiResponse";
import { AuthedRequest } from "../middleware/auth";

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  fullName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Helper to clean up CLIENT_ORIGIN
const getClientOrigin = () => {
  const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  return origin.trim().replace(/\/$/, "");
};


export async function register(req: AuthedRequest, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);
  const { email, username, password, fullName } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) return fail(res, 409, "Email or username already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, passwordHash, fullName },
  });

  const token = signToken({ userId: user.id, email: user.email });
  res.cookie("token", token, COOKIE_OPTS);
  const { passwordHash: _omit, ...safeUser } = user;
  return created(res, { user: safeUser, token }, "Registered successfully");
}

export async function login(req: AuthedRequest, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 422, parsed.error.errors[0].message);
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return fail(res, 401, "Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return fail(res, 401, "Invalid credentials");

  const token = signToken({ userId: user.id, email: user.email });
  res.cookie("token", token, COOKIE_OPTS);
  const { passwordHash: _omit, ...safeUser } = user;
  return ok(res, { user: safeUser, token }, "Logged in successfully");
}

export async function logout(_req: AuthedRequest, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  return ok(res, null, "Logged out");
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return fail(res, 404, "User not found");
  const { passwordHash: _omit, ...safeUser } = user;
  return ok(res, safeUser, "Current user");
}

// ---- GitHub OAuth 2.0 ----
export async function githubRedirect(_req: AuthedRequest, res: Response) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || "",
    redirect_uri: process.env.GITHUB_CALLBACK_URL || "",
    scope: "read:user user:email",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

export async function githubCallback(req: AuthedRequest, res: Response) {
  const code = req.query.code as string | undefined;
  const clientOrigin = getClientOrigin();

  if (!code) return fail(res, 400, "Missing GitHub OAuth code");

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return fail(res, 401, "GitHub OAuth exchange failed");

    const ghUser = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const ghEmails = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const primaryEmail =
      ghEmails.data.find((e: any) => e.primary)?.email || ghUser.data.email || `${ghUser.data.login}@users.noreply.github.com`;

    let user = await prisma.user.findUnique({ where: { githubId: String(ghUser.data.id) } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: primaryEmail } });
    }
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          username: ghUser.data.login,
          fullName: ghUser.data.name || ghUser.data.login,
          githubId: String(ghUser.data.id),
          avatarUrl: ghUser.data.avatar_url,
          githubUrl: ghUser.data.html_url,
        },
      });
    } else if (!user.githubId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { githubId: String(ghUser.data.id), avatarUrl: user.avatarUrl || ghUser.data.avatar_url },
      });
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.cookie("token", token, COOKIE_OPTS);
    return res.redirect(`${clientOrigin}/dashboard`);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return res.redirect(`${clientOrigin}/login?error=github_oauth_failed`);
  }
}
