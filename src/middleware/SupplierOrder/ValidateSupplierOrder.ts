import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../utils/errorHandler";
import { body } from "express-validator";
import OrderItem from "../../models/OrderItem";
import SupplierOrder from "../../models/SupplierOrder";
import Supplier from "../../models/Supplier";
import OrderStatus from "../../models/OrderStatus";
import SupplierOrderItem from "../../models/SupplierOrderItem";
import Perfume from "../../models/Perfume";
import Brand from "../../models/Brand";
import FraganceType from "../../models/FraganceType";
import Category from "../../models/Category";

declare global {
  namespace Express {
    interface Request {
      supplier_order?: SupplierOrder
    }
  }
}

export const validateOrderExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await SupplierOrder.findByPk(req.params.id, {
      attributes: ['id', 'total', 'createdAt'],
      include: [
        {
          model: Supplier,
          attributes: ['id', 'name'],
        },
        {
          model: OrderStatus,
          attributes: ['name']
        },
        {
          model: SupplierOrderItem,
          attributes: ['id'],
          include: [
            {
              model: OrderItem,
              attributes: ['quantity', 'price_buy', 'price_sell', 'to_earn'],
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
        }
      ],
    });

    if (!order) return errorHandler({ res, message: "Orden no encontrada", statusCode: 404 });

    req.supplier_order = order;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error al validar la orden", statusCode: 500 });
  }
};

export const validateSupplierOrderInput = async (req: Request, res: Response, next: NextFunction) => {
  await body("supplier_id")
    .notEmpty().withMessage("supplier_id es requerido")
    .isInt({ gt: 0 }).withMessage("supplier_id debe ser un número entero positivo")
    .run(req);

  await body("total")
    .notEmpty().withMessage("total es requerido")
    .isFloat({ gt: 0 }).withMessage("total debe ser un número positivo")
    .run(req);

  await body("items")
    .notEmpty().withMessage("items es requerido")
    .isArray({ min: 1 }).withMessage("Debe haber al menos un item")
    .run(req);

  await body("items.*.price_buy")
    .notEmpty().withMessage("price_buy es requerido")
    .isFloat({ gt: 0 }).withMessage("price_buy debe ser un número positivo")
    .run(req);

  await body("items.*.quantity")
    .notEmpty().withMessage("quantity es requerido")
    .isInt({ gt: 0 }).withMessage("quantity debe ser un número entero positivo")
    .run(req);

  await body("items.*.order_item_id")
    .notEmpty().withMessage("order_item_id es requerido")
    .isInt({ gt: 0 }).withMessage("order_item_id debe ser un número entero positivo")
    .run(req);

  next();
}

export const validateOrderTotal = (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body;

  const totalCalculated = items.reduce((sum: number, item: OrderItem) => {
    return sum + item.quantity * item.price_sell;
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

