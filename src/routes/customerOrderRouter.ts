import { Router } from "express";
import authenticate from "../middleware/auth";
import { OrderCustomerController } from "../Controllers/OrderCustomerController";
import { validateCustomerOrderExist } from "../middleware/CustomerOrder/validateCustomerOrder";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";

const customerOrderRouter = Router();

customerOrderRouter.use(authenticate);

customerOrderRouter.get(
    "/",
    OrderCustomerController.getAllOrders
);

customerOrderRouter.get('/:id',
    param("id")
        .isInt({ gt: 0 }).withMessage("El id debe ser un número entero válido")
        .notEmpty().withMessage("El id es requerido"),
    handleInputErrors,
    validateCustomerOrderExist,
    OrderCustomerController.getOrderById
);

customerOrderRouter.post('/',
    body("total_amount")
        .isFloat({ gt: 0 }).withMessage("El total_amount debe ser un número mayor a 0")
        .notEmpty().withMessage("El total_amount es requerido"),

    body("user_id")
        .isInt({ gt: 0 }).withMessage("El user_id debe ser un número entero válido")
        .notEmpty().withMessage("El user_id es requerido"),

    body("payment_method_id")
        .isInt({ gt: 0 }).withMessage("El payment_method_id debe ser un número entero válido")
        .notEmpty().withMessage("El payment_method_id es requerido"),
    handleInputErrors,
    OrderCustomerController.createOrder
);

export default customerOrderRouter;