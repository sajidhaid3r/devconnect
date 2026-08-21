import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { fail } from "../utils/apiResponse";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    return fail(res, 422, message);
  }
  req.body = result.data;
  next();
};
