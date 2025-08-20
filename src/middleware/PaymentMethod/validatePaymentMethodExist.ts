import type { Request, Response, NextFunction } from "express";
import PaymentMethod from "../../models/PaymentMethod";
import { errorHandler } from "../../utils/errorHandler";

declare global {
  namespace Express {
    interface Request {
      paymentMethod?: PaymentMethod
    }
  }
}

export const validatePaymentMethodExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestParam = Number(req.params?.id) ?? req.body?.payment_method_id;
    const paymentMethod = await PaymentMethod.findByPk(requestParam);

    if (!paymentMethod) return errorHandler({ res, message: "Método de pago no encontrado", statusCode: 404 });
    req.paymentMethod = paymentMethod;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error al validar la orden", statusCode: 500 });    
  }
}