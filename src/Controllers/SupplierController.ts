import type { Request, Response } from "express";
import { db } from "../config/db";
import { paginate } from "../utils/paginate";
import { errorHandler } from "../utils/errorHandler";
import SupplierOrder from "../models/SupplierOrder";
import SupplierOrderItem from "../models/SupplierOrderItem";
import OrderStatus from "../models/OrderStatus";
import Supplier from "../models/Supplier";

export class SupplierController {

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const perPage = parseInt(req.query.per_page as string) || 10;

            const orders = await paginate(SupplierOrder, {
                page,
                perPage,
                attributes: ['id', 'total', 'createdAt'],
                include: [
                    { model: Supplier, attributes: ['id', 'name', 'phone', 'email'] },
                    { model: OrderStatus, attributes: ['name'] }
                ]
            });

            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Orders", statusCode: 500 });
        }
    };

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
            res.status(200).json(req.supplierOrder);
        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Getting Order", statusCode: 500 });
        }
    }

    static deleteSupplierOrder = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {

            await SupplierOrderItem.destroy({ where: { supplier_order_id: req.supplierOrder.id }, transaction });

            await req.supplierOrder.destroy({ transaction });
            await transaction.commit();
            res.status(200).json({ message: "Orden de proveedor Eliminada correctamente!" });

        } catch (error) {
            await transaction.rollback();
            return errorHandler({ res, message: "Error al eliminar la orden del proveedor", statusCode: 500 });
        }
    };


}