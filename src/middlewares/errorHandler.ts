import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../utils/responseHandler";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      errors: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
  }

  errorResponse(res, err.message || "Internal Server Error", err.status || 500);
};
