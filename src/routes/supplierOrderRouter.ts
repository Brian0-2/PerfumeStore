import { Router } from "express";
import { body, param } from "express-validator";
import { SupplierController } from "../Controllers/SupplierController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";
import { validateOrderExist } from "../middleware/SupplierOrder/ValidateOrderExist";


const supplierRouter = Router();

supplierRouter.use(authenticate);

supplierRouter.get(
    "/",
    SupplierController.getAllOrders
);

supplierRouter.get('/:id',
    param("id")
        .isInt({ gt: 0 }).withMessage("El id debe ser un número entero válido")
        .notEmpty().withMessage("El id es requerido"),
    handleInputErrors,
    validateOrderExist,
    SupplierController.getOrderById
);

supplierRouter.post(
    '/',
    body("user_id")
        .isInt({ gt: 0 }).withMessage("El user_id debe ser un número entero válido")
        .notEmpty().withMessage("El user_id es requerido"),

    body("items")
        .isArray({ min: 1 }).withMessage("La orden debe contener al menos un item"),

    body("items.*.perfume_id")
        .isInt({ gt: 0 }).withMessage("El perfume_id de cada item debe ser un número entero válido")
        .notEmpty().withMessage("El perfume_id de cada item es requerido"),

    body("items.*.quantity")
        .isInt({ gt: 0 }).withMessage("La cantidad de cada item debe ser mayor a 0")
        .notEmpty().withMessage("La cantidad de cada item es requerida"),

    body("items.*.price_buy")
        .isFloat({ gt: 0 }).withMessage("El price_buy de cada item debe ser mayor a 0")
        .notEmpty().withMessage("El price_buy de cada item es requerido"),

    body("items.*.price_sell")
        .isFloat({ gt: 0 }).withMessage("El price_sell de cada item debe ser mayor a 0")
        .notEmpty().withMessage("El price_sell de cada item es requerido"),

    handleInputErrors,
    SupplierController.createSupplierOrder
);

export default supplierRouter;