import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/errorHandler";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return errorHandler({ res, message: "Unauthorized", statusCode: 401 });
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    return errorHandler({ res, message: "Token missing", statusCode: 401 });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    if (typeof decoded !== 'object' || !decoded.id) {
      return errorHandler({ res, message: "Invalid token payload", statusCode: 401 });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) {
      return errorHandler({ res, message: "User not found", statusCode: 401 });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return errorHandler({ res, message: "Token expired", statusCode: 401 });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return errorHandler({ res, message: "Invalid token", statusCode: 401 });
    }
    return errorHandler({ res, message: "Server error", statusCode: 500 });
  }
};

export default authenticate;
