import { Router } from "express";
import { body, param } from "express-validator";
import { SupplierController } from "../Controllers/SupplierController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";
import { validateOrderExist } from "../middleware/SupplierOrder/ValidateSupplierOrder";
import { validateUserRole } from "../middleware/validateUserRole";

const supplierRouter = Router();
supplierRouter.use(authenticate,validateUserRole('admin'));

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
    SupplierController.createSupplierOrder
);

export default supplierRouter;