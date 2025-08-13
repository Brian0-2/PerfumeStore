import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import CustomerOrder from "../models/CustomerOrder";

export class OrderCustomerController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await CustomerOrder.findAll({
                where: { id: req.user.id }
            });
            //TODO
            res.status(200).json({ orders });
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    }

    static createOrder = async (req: Request, res: Response) => {
        try {
            const { total_amount, user_id, payment_method_id } = req.body;
            await CustomerOrder.create({
                total_amount,
                is_paid: false,
                user_id,
                order_status_id: 1,
                payment_method_id
            });

            res.status(201).json({ message: "Orden Creada Correctamente!" })
        } catch (error) {
            return errorHandler({ res, message: "Error Creating Order", statusCode: 500 });
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.customerOrder);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });            
        }
    }


}