import { Router } from "express";
import { param } from "express-validator";
import { SupplierController } from "../Controllers/SupplierController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { validateOrderExist, validateSupplierOrderInput } from "../middleware/SupplierOrder/ValidateSupplierOrder";
import { validateUserRole } from "../middleware/validateUserRole";
import { validateOrderTotal } from "../middleware/Order/validateOrder";
import authenticate from "../middleware/auth";

const supplierRouter = Router();
supplierRouter.use(authenticate, validateUserRole('admin'));

supplierRouter.get("/",
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

supplierRouter.post('/',
    validateSupplierOrderInput,
    handleInputErrors,
    validateOrderTotal,
    SupplierController.createSupplierOrder
);

export default supplierRouter;