import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Tipo para errores individuales
type FormattedError = { field?: string; message: string };

// Tipo para la respuesta de error completa
type ErrorResponse = {
  success: false;
  message: string;
  errors: FormattedError[];
};

export const handleInputErrors = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
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
    return;
  }

  next();
};
