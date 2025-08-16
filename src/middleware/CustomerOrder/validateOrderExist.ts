// middleware: validateOrderExist.ts
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../utils/errorHandler";
import Order from "../../models/Order";

declare global {
  namespace Express {
    interface Request {
      order?: Order
    }
  }
}

export const validateOrderExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      attributes: ['id']
    });

    if (!order) return errorHandler({ res, message: "Orden no encontrada", statusCode: 404 });

    req.order = order;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error al validar la orden", statusCode: 500 });
  }
};
