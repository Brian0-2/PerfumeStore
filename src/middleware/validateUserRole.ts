import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler";

type UserRole = "admin" | "client";

export const validateUserRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) 
        return errorHandler({ res, message: "User not authenticated", statusCode: 401 });
    if (user.role !== requiredRole) 
        return errorHandler({ res, message: "Forbidden: insufficient permissions", statusCode: 403 });
    next();
  };
};
