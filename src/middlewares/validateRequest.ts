import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.errors.map((err) => ({
          field:
            err.path.length > 0 ? err.path.join('.') : 'Req body is undefined',
          message: err.message,
        })),
      });
      return;
    }

    next();
  };
};
