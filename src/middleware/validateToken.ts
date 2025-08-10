import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { errorHandler } from "../utils/errorHandler";

type tokenForm = {
    id: string,
    token : string,
    tokenExpiresAt : Date
}

declare global {
  namespace Express {
    interface Request {
      tokenData?: tokenForm;
    }
  }
}

export const validateTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token || req.body.token || req.headers['authorization']?.split(' ')[1];

    if (!token) return errorHandler({ res, message: "Token is required", statusCode: 400 });

    const user = await User.findOne({
      where: { token },
      attributes: ['id', 'token', 'tokenExpiresAt'],
    });

    if (!user || !user.tokenExpiresAt || user.tokenExpiresAt < new Date()) 
        return errorHandler({ res, message: "Invalid token or expired", statusCode: 401 });
    
    req.tokenData = {
      id: user.id,
      token: user.token,
      tokenExpiresAt: user.tokenExpiresAt,
    };

    next();
  } catch (error) {
    return errorHandler({ res, message: "Error validating token", statusCode: 500 });
  }
};
