// middleware: validateOrderExist.ts
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../utils/errorHandler";
import { body } from "express-validator";
import Order from "../../models/Order";
import OrderItem from "../../models/OrderItem";
import OrderStatus from "../../models/OrderStatus";
import User from "../../models/User";
import Perfume from "../../models/Perfume";
import Brand from "../../models/Brand";
import FraganceType from "../../models/FraganceType";
import Category from "../../models/Category";
import Supplier from "../../models/Supplier";

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
 attributes: ['id', 'is_paid', 'total','amount_paid', 'createdAt'],
      include: [
        {
          model: OrderStatus,
          attributes: ['id', 'name']
        },
        {
          model: User, 
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          attributes: ['id', 'quantity', 'price_buy', 'price_sell', 'to_earn'],
          include: [
            {
              model: Perfume,
              attributes: ['id', 'name', 'size', 'image_url'],
              include: [
                { model: Brand, attributes: ['id', 'name'] },
                { model: FraganceType, attributes: ['id', 'name'] },
                { model: Category, attributes: ['id', 'name'] },
                { model: Supplier, attributes: ['id', 'name'] }
              ]
            }
          ]
        }
      ]
    });

    if (!order) return errorHandler({ res, message: "Orden no encontrada", statusCode: 404 });

    req.order = order;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error al validar la orden", statusCode: 500 });
  }
};

export const validateOrderInput = async (req: Request, res: Response, next: NextFunction) => {
    
  await body("user_id")
    .notEmpty().withMessage("user_id es requerido")
    .isInt({ gt: 0 }).withMessage("user_id debe ser un número entero positivo")
    .run(req);

  await body("total")
    .notEmpty().withMessage("total es requerido")
    .isFloat({ gt: 0 }).withMessage("total debe ser un número positivo")
    .run(req);

  await body("items")
    .notEmpty().withMessage("items es requerido")
    .isArray({ min: 1 }).withMessage("Debe haber al menos un item")
    .run(req);

  await body("items.*.perfume_id")
    .notEmpty().withMessage("perfume_id es requerido")
    .isInt({ gt: 0 }).withMessage("perfume_id debe ser un número entero positivo")
    .run(req);

  await body("items.*.quantity")
    .notEmpty().withMessage("quantity es requerido")
    .isInt({ gt: 0 }).withMessage("quantity debe ser un número entero positivo")
    .run(req);

  await body("items.*.price_sell")
    .notEmpty().withMessage("price_sell es requerido")
    .isFloat({ gt: 0 }).withMessage("price_sell debe ser un número positivo")
    .run(req);

  await body("items.*.price_buy")
    .notEmpty().withMessage("price_buy es requerido")
    .isFloat({ gt: 0 }).withMessage("price_buy debe ser un número positivo")
    .run(req);

  next();
};


export const validateOrderTotal = (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body;

  const totalCalculated = items.reduce((sum: number, item: OrderItem) => {
    return sum + item.quantity * item.price_buy;
  }, 0);

  if (parseFloat(req.body.total) !== totalCalculated) {
    return errorHandler({
      res,
      message: `El total enviado (${req.body.total}) no coincide con la suma de los items (${totalCalculated})`,
      statusCode: 422
    });
  }

  next();
};

