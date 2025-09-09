import { Router } from "express";
import { CustomerController } from "../Controllers/CustomerController";
import { validateUserRole } from "../middleware/validateUserRole";
import authenticate from "../middleware/auth";
import { validateOrderExist } from "../middleware/Order/validateOrder";
import { param, query } from "express-validator";
import { validateOrderBelongsToUser } from "../middleware/Customer/validateCustomer";
import { handleInputErrors } from "../middleware/handleInputErrors";

const customerRouter = Router();

customerRouter.use(authenticate, validateUserRole('client'));

customerRouter.get("/profile",
    CustomerController.getCustomerProfile
);

customerRouter.get("/orders",
    query('page').optional().isInt().withMessage('El número de página debe ser un número entero'),
    query('per_page').optional().isInt().withMessage('El número de elementos por página debe ser un número entero'),
    handleInputErrors,
    CustomerController.getAllCustomerOrders
);

customerRouter.get("/orders/:id",
    param('id')
        .isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID de la orden es obligatorio'),
    handleInputErrors,
    validateOrderExist,
    validateOrderBelongsToUser,
    CustomerController.getCustomerOrder
);

export default customerRouter;