import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal server error";
  if (process.env.NODE_ENV !== "test") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, message);
  }
  return fail(res, statusCode, message);
}

export function notFoundHandler(req: Request, res: Response) {
  return fail(res, 404, `Route ${req.originalUrl} not found`);
}
