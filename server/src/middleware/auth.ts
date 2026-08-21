import { NextFunction, Request, Response } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { fail } from "../utils/apiResponse";

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

// Auth flow per PDF: JWT issued on login → stored in httpOnly cookie
// Also accepts Authorization: Bearer <token> so the API is testable without cookies.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const cookieToken = (req as any).cookies?.token;
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const token = cookieToken || bearerToken;

  if (!token) {
    return fail(res, 401, "Authentication required");
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return fail(res, 401, "Invalid or expired token");
  }
}
