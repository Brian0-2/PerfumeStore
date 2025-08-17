import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import Order from "../models/Order";


export class SupplierController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await Order.findAll({
                //TODO
            });
            res.status(200).json({ orders });
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    }

    static createSupplierOrder = async (req: Request, res: Response) => {
        try {
           //TODO
            res.send("Create Supplier Order");            
        } catch (error) {
            return errorHandler({ res, message: "Error Creating Orders", statusCode: 500 });
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        try {
            //TODO
            res.status(200).json(req.order);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });
        }
    }
}