import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { db } from "../config/db";
import Perfume from "../models/Perfume";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";

export class OrderCustomerController {

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
            const { total_amount, user_id, payment_method_id, perfumes } = req.body 

            // 1️⃣ Crear la orden principal
            const newOrder = await Order.create({
                total_amount,
                is_paid: false,
                user_id,
                order_status_id: 1,
                payment_method_id
            }, { transaction });

            // 2️⃣ Verificar que todos los perfumes existen
            const perfumeIds = perfumes.map(p => p.perfume_id);
            const existingPerfumes = await Perfume.findAll({
                where: { id: perfumeIds },
                transaction
            });

            if (existingPerfumes.length !== perfumeIds.length) {
                throw new Error("Uno o más perfumes no existen");
            }

            // 3️⃣ Crear los detalles de la orden
            const orderDetails = perfumes.map(item => ({
                customer_order_id: newOrder.id,
                perfume_id: item.perfume_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.quantity * item.unit_price
            }));

            await OrderItem.bulkCreate(orderDetails, { transaction });

            // 4️⃣ Confirmar cambios
            await transaction.commit();

             res.status(201).json({
                message: "Orden creada correctamente",
                order_id: newOrder.id
            });

        } catch (err) {
            await transaction.rollback();
            const message = err instanceof Error ? err.message : "Error creando orden";
            return errorHandler({ res, message, statusCode: 500 });
        }
    };


    static getOrderById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.order);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });            
        }
    }

    //TODO
    static createCustomerOrderDetrail  = async (req: Request, res: Response) => {
        try {
            const {customer_order_id, perfume_id, quantity, unit_price} = req.body;
            const subtotal = Number(quantity) * Number(unit_price);

            const orderItems = await OrderItem.create({
                customer_order_id,
                perfume_id,
                quantity,
                unit_price,
                subtotal 
            })

            res.status(201).json({message : "Perfume añadido a la orden correctamente"});

        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });            
        }
    }

}