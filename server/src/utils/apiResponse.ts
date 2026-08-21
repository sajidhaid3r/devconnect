import { Response } from "express";

// Consistent API response format required by the PDF: {success, data, message}
export function sendResponse<T>(
  res: Response,
  statusCode: number,
  success: boolean,
  data: T | null,
  message: string
) {
  return res.status(statusCode).json({ success, data, message });
}

export function ok<T>(res: Response, data: T, message = "OK") {
  return sendResponse(res, 200, true, data, message);
}

export function created<T>(res: Response, data: T, message = "Created") {
  return sendResponse(res, 201, true, data, message);
}

export function fail(res: Response, statusCode: number, message: string) {
  return sendResponse(res, statusCode, false, null, message);
}
