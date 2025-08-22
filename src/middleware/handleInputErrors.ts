import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

type FormattedError = { field?: string; message: string };

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const formattedErrors: FormattedError[] = result.array().map((err: any) => ({
      field: err.param || err.path,
      message: err.msg || "Error de validación desconocido",
    }));

    res.status(422).json({
      success: false,
      message: "Errores de validación",
      errors: formattedErrors,
    });
  }

  next();
};
