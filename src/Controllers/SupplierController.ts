import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import Supplier from "../models/Supplier";
import SupplierOrder from "../models/SuplierOrder";
import OrderStatus from "../models/OrderStatus";
import PaymentMethod from "../models/PaymentMethod";


export class SupplierController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await SupplierOrder.findAll({
                include: [
                    {
                        model: Supplier,
                        attributes: ['name']
                    },
                    {
                        model: OrderStatus,
                        attributes: ['id', 'name']
                    },
                    {
                        model: PaymentMethod,
                        attributes: ['id', 'name']
                    },
                ],
                attributes: ['id', 'total_amount', 'createdAt']
            });
            res.status(200).json({ orders });
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    }

    static createSupplierOrder = async (req: Request, res: Response) => {
        try {
            //TODO            
        } catch (error) {
            return errorHandler({ res, message: "Error Creating Orders", statusCode: 500 });
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        try {
            //TODO
            res.status(200).json(req.supplier_order);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });
        }
    }
}