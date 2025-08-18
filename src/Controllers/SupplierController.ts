import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import Order from "../models/Order";
import SupplierOrder from "../models/SupplierOrder";
import SupplierOrderItem from "../models/SupplierOrderItem";
import { db } from "../config/db";

export class SupplierController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await Order.findAll({});
            res.status(200).json({ orders });
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    }

    static createSupplierOrder = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {
            const { supplier_id, total, items } = req.body;

            const newOrder = await SupplierOrder.create({
                supplier_id,
                total,
                order_status_id: 1
            });

            const sipplierOrderItemsData = items.map((item: SupplierOrderItem) => {
                return {
                    order_item_id: item.order_item_id,
                    supplier_order_id: newOrder.id
                }
            });

            await SupplierOrderItem.bulkCreate(sipplierOrderItemsData, { transaction });
            await transaction.commit();

            res.status(201).json({ message: "Orden creada correctamente" });
        } catch (error) {
            await transaction.rollback();
            return errorHandler({ res, message: "Error Creating Orders", statusCode: 500 });
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        try {
            res.status(200).json( req.supplier_order);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });
        }
    }
}