import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { db } from "../config/db";
import Payment from "../models/Payment";
import Order from "../models/Order";

export class PaymentController {

    static createPayment = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {
            const { amount, note } = req.body;

            const currentPaid = Number(req.order.amount_paid ?? 0);
            const orderTotal = Number(req.order.total);
            const paymentAmount = Number(amount);

            // validate payment total
            if (currentPaid + paymentAmount > orderTotal) {
                await transaction.rollback();
                return errorHandler({ res, message: `El pago excede el total. Queda por pagar ${orderTotal - currentPaid}`, statusCode: 400 });
            }

            await Payment.create({
                amount: paymentAmount,
                payment_method_id: req.paymentMethod.id,
                order_id: req.order.id,
                note
            }, { transaction });

            req.order.amount_paid = currentPaid + paymentAmount;

            if (req.order.amount_paid === orderTotal) {
                req.order.is_paid = true;
            }

            await req.order.save({ transaction });
            await transaction.commit();
            res.status(201).json({ message: "Pago creado correctamente!" });

        } catch (error) {
            await transaction.rollback();
            return errorHandler({ res, message: "Error Creating Payment", statusCode: 500 });
        }
    }

    static updatePayment = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {
            const { amount, note, payment_method_id, order_id } = req.body;

            const oldAmount = Number(req.payment.amount);
            const newAmount = Number(amount);

            // Validate order
            if (!req.order || req.order.id !== Number(order_id)) {
                await transaction.rollback();
                return errorHandler({
                    res,
                    message: "La orden enviada no coincide con la del pago",
                    statusCode: 400
                });
            }

            const currentPaid = Number(req.order.amount_paid ?? 0);
            const orderTotal = Number(req.order.total);

            const updatedPaid = currentPaid - oldAmount + newAmount;

            if (updatedPaid > orderTotal) {
                await transaction.rollback();
                return errorHandler({
                    res,
                    message: `La actualización excede el total. Queda por pagar ${orderTotal - currentPaid}`,
                    statusCode: 400
                });
            }

            // Update payment details
            req.payment.amount = newAmount;
            req.payment.note = note;
            req.payment.payment_method_id = payment_method_id;
            req.payment.order_id = order_id;

            await req.payment.save({ transaction });

            // Update order details
            req.order.amount_paid = updatedPaid;
            req.order.is_paid = req.order.amount_paid === orderTotal;

            await req.order.save({ transaction });
            await transaction.commit();
            res.status(200).json({ message: "Pago actualizado correctamente!" });

        } catch (error) {
            await transaction.rollback();
            return errorHandler({ res, message: "Error Updating Payment", statusCode: 500 });
        }
    }

    static getPaymentById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.payment);
        } catch (error) {
            return errorHandler({ res, message: "Error Updating Payment", statusCode: 500 });            
        }
    }

    static deletePayment = async (req: Request, res: Response) => {
        const transaction = await db.transaction();
        try {

            const order = await Order.findByPk(req.payment.order_id);
            if (!order) {
                await transaction.rollback();
                return errorHandler({ res, message: "Orden asociada al pago no encontrada", statusCode: 404 });
            }

            const orderTotal = Number(order.total);
            const currentPaid = Number(order.amount_paid ?? 0);
            const paymentAmount = Number(req.payment.amount);

            const updatedPaid = Math.max(currentPaid - paymentAmount, 0);

            // Update Order
            order.amount_paid = updatedPaid;
            order.is_paid = order.amount_paid === orderTotal;
            await order.save({ transaction });

            // Delete Payment
            await req.payment.destroy({ transaction });
            await transaction.commit();
            res.status(200).json({ message: "Pago eliminado correctamente!" });

        } catch (error) {
            await transaction.rollback();
            return errorHandler({ res, message: "Error al eliminar el pago", statusCode: 500 });
        }
    };



}
