import { NextFunction, Request, Response } from "express";

// Wraps async route handlers so thrown errors reach the error-handling middleware
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
