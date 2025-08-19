import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler";

type UserRole = "admin" | "client";

export const validateUserRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== requiredRole) return errorHandler({ res, message: "Forbidden: No permissions", statusCode: 403 });
    next();
  };
};