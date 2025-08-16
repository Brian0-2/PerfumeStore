import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { db } from "../config/db";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import OrderStatus from "../models/OrderStatus";
import Perfume from "../models/Perfume";
import Brand from "../models/Brand";
import FraganceType from "../models/FraganceType";
import Category from "../models/Category";
import Supplier from "../models/Supplier";
import User from "../models/User";

export class OrderController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['name']
                    },
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    },
                ],
                attributes: ['id', 'is_paid', 'createdAt']
            });
            
            res.status(200).json({ orders });
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    }

    static createCustomerOrder = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {
            const { user_id, items } = req.body;

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
            await transaction.commit();

            res.status(201).json({ message: "Orden creada correctamente" });
        } catch (err) {
            await transaction.rollback();
            return errorHandler({ res, message :"Error creando orden", statusCode: 500 });
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        try {
            const orderWithDetails = await req.order.reload({
                attributes: ['id', 'is_paid', 'user_id', 'createdAt'],
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    },
                    {
                        model: OrderItem,
                        attributes: ['id', 'quantity', 'price_sell'],
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

            res.status(200).json(orderWithDetails);
        } catch (error) {
            return errorHandler({ res, message: "Error obteniendo la orden", statusCode: 500 });
        }
    };
}