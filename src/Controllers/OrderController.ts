import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { db } from "../config/db";
import Perfume from "../models/Perfume";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";

export class OrderController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await Order.findAll({
                where: { id: req.user.id }
            });
            //TODO
            res.status(200).json({ orders });
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    }

    static createCustomerOrder = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {
            const { user_id, items } = req.body;

            // Create Order
            const newOrder = await Order.create({
                user_id,
                order_status_id: 1,
                is_paid: false
            }, { transaction });

            const orderItemsData = items.map((item: OrderItem) => {
                return {
                    order_id: newOrder.id,
                    perfume_id: item.perfume_id,
                    quantity: item.quantity,
                    price_buy: item.price_buy,
                    price_sell: item.price_sell,
                    to_earn: (item.price_sell - item.price_buy) * item.quantity
                };
            });

            await OrderItem.bulkCreate(orderItemsData, { transaction });

            // Confirm transaction
            await transaction.commit();

            res.status(201).json({ message: "Orden creada correctamente" });
        } catch (err) {
            await transaction.rollback();
            const message = err instanceof Error ? err.message : "Error creando orden";
            return errorHandler({ res, message, statusCode: 500 });
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.order);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });
        }
    }
}