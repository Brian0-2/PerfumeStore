import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../utils/errorHandler";

export const validateOrderBelongsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.order?.user_id !== req.user?.id) {
            res.status(403).json({ message: "Esta orden no te pertenece." });
            return;
        }
        next();
    } catch (error) {
        return errorHandler({ res, message: "Error al validar la orden", statusCode: 500 });
    }
};
