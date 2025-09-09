import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import Order from "../models/Order";
import User from "../models/User";
import OrderItem from "../models/OrderItem";
import OrderStatus from "../models/OrderStatus";
import Perfume from "../models/Perfume";
import Brand from "../models/Brand";
import FraganceType from "../models/FraganceType";
import Category from "../models/Category";
import { paginate } from "../utils/paginate";

export class CustomerController {

    static getCustomerProfile = async (req: Request, res: Response) => {
        try {

            const userFiltered = {
                id: req.user?.id,
                name: req.user?.name,
                email: req.user?.email,
            }

            res.status(200).json(userFiltered);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Customer Profile", statusCode: 500 });
        }
    };

    static getAllCustomerOrders = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const perPage = parseInt(req.query.perPage as string) || 10;

            const customerOrders = await paginate(Order, {
                page,
                perPage,
                where: { user_id: req.user.id },
                attributes: ['id', 'is_paid', 'total', 'amount_paid', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: OrderStatus,
                        attributes: ['name']
                    }
                ]
            });

            res.status(200).json(customerOrders);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting All Customer Orders", statusCode: 500 });
        }
    }

    static getCustomerOrder = async (req: Request, res: Response) => {
        try {

            const customerOrderItems = await Order.findOne({
                where: { id: req.order.id, user_id: req.user?.id },
                attributes: ['id', 'is_paid', 'total', 'amount_paid', 'createdAt', 'updatedAt'],
                include: [
                    { model: OrderStatus, attributes: ['name'] },
                    {
                        model: OrderItem,
                        attributes: ['quantity', 'price_sell'],
                        include: [
                            {
                                model: Perfume,
                                attributes: ['id', 'name', 'size', 'image_url'],
                                include: [
                                    { model: Brand, attributes: ['name'] },
                                    { model: FraganceType, attributes: ['name'] },
                                    { model: Category, attributes: ['name'] },
                                ],
                            },
                        ],
                    },
                ],
            });


            res.status(200).json(customerOrderItems);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Customer Orders", statusCode: 500 });
        }
    };

}
