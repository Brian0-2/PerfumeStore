import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";
import { PerfumeController } from "../Controllers/PerfumeController";

const perfumeRouter = Router();

perfumeRouter.use(authenticate);

perfumeRouter.get("/", PerfumeController.getAllPerfumes);

perfumeRouter.get("/:id",
  param("id").isInt().withMessage("Perfume ID must be an integer").toInt(),
  handleInputErrors,
  PerfumeController.getPerfumeById
);

perfumeRouter.post("/",
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe tener entre 10 y 500 caracteres"),
  body("size")
    .trim()
    .notEmpty()
    .withMessage("La talla es obligatoria")
    .isLength({ max: 50 })
    .withMessage("La talla debe tener como máximo 50 caracteres"),
  body("image")
    .trim()
    .notEmpty()
    .withMessage("La URL de la imagen es obligatoria")
    .isURL()
    .withMessage("La imagen debe ser una URL válida"),
  body("supplier_price")
    .notEmpty()
    .withMessage("El precio del proveedor es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El precio del proveedor debe ser un número decimal positivo"),
  body("to_earn")
    .notEmpty()
    .withMessage("El valor de ganancia es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("La ganancia debe ser un número decimal positivo"),
  body("brand_id")
    .notEmpty()
    .withMessage("El ID de la marca es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID de la marca debe ser un número entero positivo"),
  body("fragance_type_id")
    .notEmpty()
    .withMessage("El ID del tipo de fragancia es obligatorio")
    .isInt({ gt: 0 })
    .withMessage(
      "El ID del tipo de fragancia debe ser un número entero positivo"
    ),
  body("supplier_id")
    .notEmpty()
    .withMessage("El ID del proveedor es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID del proveedor debe ser un número entero positivo"),
  body("category_id")
    .notEmpty()
    .withMessage("El ID de la categoría es obligatorio")
    .isInt({ gt: 0 })
    .withMessage("El ID de la categoría debe ser un número entero positivo"),
  handleInputErrors,
  PerfumeController.createPerfume
);

export default perfumeRouter;
