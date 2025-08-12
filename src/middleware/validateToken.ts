import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import User from "../models/User";
import { errorHandler } from "../utils/errorHandler";


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token || req.body.token || req.headers['authorization']?.split(' ')[1];

    if (!token) return errorHandler({ res, message: "Token is required", statusCode: 400 });

    const user = await User.findOne({
      attributes: ['id', 'password', 'confirmed', 'token', 'tokenExpiresAt'],
      where: { token }
    });

    if (!user) return errorHandler({ res, message: "Token inválido o expirado", statusCode: 401 });

    if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
      user.token = null;
      user.tokenExpiresAt = null;
      await user.save();

      return errorHandler({ res, message: "Token inválido o expirado", statusCode: 401 });
    }

    req.user = user;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error validating token", statusCode: 500 });
  }
};
