// middleware: validateOrderExist.ts
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../utils/errorHandler";
import SupplierOrder from "../../models/SuplierOrder";

declare global {
  namespace Express {
    interface Request {
      supplier_order?: SupplierOrder
    }
  }
}

export const validateOrderExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await SupplierOrder.findByPk(req.params.id);

    if (!order) return errorHandler({ res, message: "Orden no encontrada", statusCode: 404 });

    req.supplier_order = order;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error al validar la orden", statusCode: 500 });
  }
};
