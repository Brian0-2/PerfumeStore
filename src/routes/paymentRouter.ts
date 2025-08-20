import { Router } from "express";
import { PaymentController } from "../Controllers/PaymentController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { validateUserRole } from "../middleware/validateUserRole";
import { validateOrderExist } from "../middleware/Order/validateOrder";
import { validatePaymentMethodExist } from "../middleware/PaymentMethod/validatePaymentMethodExist";
import { paymentExist, paymentHasBeenPaid, validatePaymentInput } from "../middleware/Payment/validatePayment";
import { limiter } from "../config/limiter";
import authenticate from "../middleware/auth";

const paymentRouter = Router();
paymentRouter.use(authenticate, validateUserRole('admin'));

paymentRouter.post('/',
    validatePaymentInput,
    handleInputErrors,
    validateOrderExist,
    paymentHasBeenPaid,
    validatePaymentMethodExist,
    PaymentController.createPayment
)

paymentRouter.get('/:id/update',
    param("id")
        .exists().withMessage("El ID del pago es obligatorio")
        .isInt({ gt: 0 }).withMessage("El ID del pago debe ser un número entero positivo"),
    validatePaymentInput,
    handleInputErrors,
    limiter(5),
    validateOrderExist,
    paymentHasBeenPaid,
    paymentExist,
    validatePaymentMethodExist,
    PaymentController.updatePayment
);

paymentRouter.get('/:id',
    param("id")
        .exists().withMessage("El ID del pago es obligatorio")
        .isInt({ gt: 0 }).withMessage("El ID del pago debe ser un número entero positivo"),
    handleInputErrors,
    paymentExist,
    PaymentController.getPaymentById
);

paymentRouter.delete('/:id',
    param("id")
        .exists().withMessage("El ID del pago es obligatorio")
        .isInt({ gt: 0 }).withMessage("El ID del pago debe ser un número entero positivo"),
    handleInputErrors,
    paymentExist,
    PaymentController.deletePayment
);



export default paymentRouter;