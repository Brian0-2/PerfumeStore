import { Router } from "express";
import { body, param } from "express-validator";
import { OrderController } from "../Controllers/OrderController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import {
    validateOrderExist,
    validateOrderExistAndShowDetails,
    validateOrderInput,
    validateOrderTotal
} from "../middleware/CustomerOrder/validateCustomerOrder";
import { validateUserRole } from "../middleware/validateUserRole";
import authenticate from "../middleware/auth";
import { limiter } from "../config/limiter";

const orderRouter = Router();
orderRouter.use(authenticate, validateUserRole('admin'));

orderRouter.get(
    "/",
    OrderController.getAllOrders
);

orderRouter.get('/:id',
    param("id")
        .isInt({ gt: 0 }).withMessage("El id debe ser un número entero válido")
        .notEmpty().withMessage("El id es requerido"),
    handleInputErrors,
    validateOrderExistAndShowDetails,
    OrderController.getOrderById
);

orderRouter.patch('/:id/edit',
    param("id")
        .isInt({ gt: 0 }).withMessage("El id debe ser un número entero válido")
        .notEmpty().withMessage("El id es requerido"),
    body("order_status_id")
        .isInt({ gt: 0 }).withMessage("El order_status_id debe ser un número entero válido")
        .notEmpty().withMessage("El order_status_id es requerido"),
    handleInputErrors,
    limiter(5),
    validateOrderExist,
    OrderController.updateOrderStatusById
)

orderRouter.post(
    '/',
    validateOrderInput,
    handleInputErrors,
    validateOrderTotal,
    OrderController.createCustomerOrder
);

export default orderRouter;