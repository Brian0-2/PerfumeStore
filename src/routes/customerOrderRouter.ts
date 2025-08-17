import { Router } from "express";
import { body, param } from "express-validator";
import { OrderController } from "../Controllers/OrderController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { validateOrderExist, validateOrderInput, validateOrderTotal } from "../middleware/CustomerOrder/validateCustomerOrder";
import authenticate from "../middleware/auth";
import { validateUserRole } from "../middleware/validateUserRole";

const customerOrderRouter = Router();
customerOrderRouter.use(authenticate,validateUserRole('admin'));

customerOrderRouter.get(
    "/",
    OrderController.getAllOrders
);

customerOrderRouter.get('/:id',
    param("id")
        .isInt({ gt: 0 }).withMessage("El id debe ser un número entero válido")
        .notEmpty().withMessage("El id es requerido"),
    handleInputErrors,
    validateOrderExist,
    OrderController.getOrderById
);

customerOrderRouter.post(
    '/',
    validateOrderInput,
    handleInputErrors,
    validateOrderTotal,
    OrderController.createCustomerOrder
);

export default customerOrderRouter;