import { Request,Response,NextFunction } from "express";
import CustomerOrder from "../../models/CustomerOrder";
import { errorHandler } from "../../utils/errorHandler";


declare global {
  namespace Express {
    interface Request {
      customerOrder?: CustomerOrder
    }
  }
}

export const validateCustomerOrderExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerOrder = await CustomerOrder.findByPk(req.params.id)

    if (!customerOrder) return errorHandler({ res, message: "Orden no encontrada", statusCode: 404 });
    req.customerOrder = customerOrder;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });
  }
}