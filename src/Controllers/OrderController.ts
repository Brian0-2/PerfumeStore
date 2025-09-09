import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { db } from "../config/db";
import { paginate } from "../utils/paginate";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import OrderStatus from "../models/OrderStatus";
import User from "../models/User";

export class OrderController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const perPage = parseInt(req.query.per_page as string) || 10;

            const order = await paginate(Order, {
                page,
                perPage,
                attributes: ['id', 'is_paid','total','amount_paid','createdAt'],
                include: [
                    {
                        model: User,
                        attributes: ['name']
                    },
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    }
                ],
                where: { user_id: req.user?.id }
            });

            res.status(200).json(order);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    };

    static createCustomerOrder = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {
            const {
                user_id,
                total,
                items
            } = req.body;

            const newOrder = await Order.create({
                user_id,
                total,
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
            await transaction.commit();

            res.status(201).json({ message: "Orden creada correctamente" });
        } catch (err) {
            await transaction.rollback();
            return errorHandler({ res, message: "Error creando orden", statusCode: 500 });
        }
    }
    
    static getOrderById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.order);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error obteniendo la orden", statusCode: 500 });
        }
    };

    static updateOrderStatusById = async (req: Request, res: Response) => {
        try {
            req.order.order_status_id = req.body.order_status_id;
            await req.order.save();

            res.status(200).json({ message: "Estado de la orden actualizado correctamente" });
        } catch (error) {
            return errorHandler({ res, message: "Error obteniendo la orden", statusCode: 500 });
        }
    }

}