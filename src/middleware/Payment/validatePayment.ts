import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../utils/errorHandler";
import Payment from "../../models/Payment";
import { body } from "express-validator";

declare global {
  namespace Express {
    interface Request {
      payment?: Payment
    }
  }
}

export const paymentHasBeenPaid = async (req: Request, res: Response, next: NextFunction) => {
  if (req.order?.is_paid) return errorHandler({ res, message: "El pedido ya ha sido pagado", statusCode: 400 });
  next();
}

export const paymentExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentParam = req.body?.payment_id ?? Number(req.params?.id);

    const payment = await Payment.findByPk(paymentParam);
    if (!payment) return errorHandler({ res, message: "El pago no existe", statusCode: 404 });

    req.payment = payment;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error al validar el pago", statusCode: 400 });
  }
}

export const validatePaymentInput = async (req: Request, res: Response, next: NextFunction) => {
  await body("amount")
    .exists().withMessage("El monto es obligatorio")
    .isFloat({ gt: 0 }).withMessage("El monto debe ser un número mayor a 0").run(req),

    await body("payment_method_id")
      .exists().withMessage("El método de pago es obligatorio")
      .isInt({ gt: 0 }).withMessage("El método de pago debe ser un número entero positivo").run(req),

    await body("order_id")
      .exists().withMessage("El ID de la orden es obligatorio")
      .isInt({ gt: 0 }).withMessage("El ID de la orden debe ser un número entero positivo").run(req),

    await body("note")
      .optional()
      .isString().withMessage("La nota debe ser texto").run(req),

      next();
}