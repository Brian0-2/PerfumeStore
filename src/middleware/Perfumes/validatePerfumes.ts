import type { Request, Response, NextFunction } from 'express'
import { param, validationResult, body } from 'express-validator'
import Perfume from '../../models/Perfume'
import { errorHandler } from '../../utils/errorHandler'

declare global {
  namespace Express {
    interface Request {
      perfume?: Perfume
    }
  }
}

export const validatePerfumeExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id)

    if (!perfume) return errorHandler({ res, message: "Perfume no encontrado", statusCode: 404 });
    req.perfume = perfume;
    next();
  } catch (error) {
    return errorHandler({ res, message: "Error Getting Perfume", statusCode: 500 });
  }
}

export const validatePerfumeInput = async (req: Request, res: Response, next: NextFunction) => {

    await body("name")
      .trim()
      .notEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ min: 3, max: 100 })
      .withMessage("El nombre debe tener entre 3 y 100 caracteres").run(req),
    await body("description")
      .trim()
      .notEmpty()
      .withMessage("La descripción es obligatoria")
      .isLength({ min: 10, max: 500 })
      .withMessage("La descripción debe tener entre 10 y 500 caracteres").run(req),
    await body("size")
      .trim()
      .notEmpty()
      .withMessage("La talla es obligatoria")
      .isLength({ max: 50 })
      .withMessage("La talla debe tener como máximo 50 caracteres").run(req),
    await body("image")
      .trim()
      .notEmpty()
      .withMessage("La URL de la imagen es obligatoria")
      .isURL()
      .withMessage("La imagen debe ser una URL válida").run(req),
    await body("supplier_price")
      .notEmpty()
      .withMessage("El precio del proveedor es obligatorio")
      .isFloat({ gt: 0 })
      .withMessage("El precio del proveedor debe ser un número decimal positivo").run(req),
    await body("to_earn")
      .notEmpty()
      .withMessage("El valor de ganancia es obligatorio")
      .isFloat({ gt: 0 })
      .withMessage("La ganancia debe ser un número decimal positivo").run(req),
    await body("brand_id")
      .notEmpty()
      .withMessage("El ID de la marca es obligatorio")
      .isInt({ gt: 0 })
      .withMessage("El ID de la marca debe ser un número entero positivo").run(req),
    await body("fragance_type_id")
      .notEmpty()
      .withMessage("El ID del tipo de fragancia es obligatorio")
      .isInt({ gt: 0 })
      .withMessage(
        "El ID del tipo de fragancia debe ser un número entero positivo").run(req),
    await body("supplier_id")
      .notEmpty()
      .withMessage("El ID del proveedor es obligatorio")
      .isInt({ gt: 0 })
      .withMessage("El ID del proveedor debe ser un número entero positivo").run(req),
    await body("category_id")
      .notEmpty()
      .withMessage("El ID de la categoría es obligatorio")
      .isInt({ gt: 0 })
      .withMessage("El ID de la categoría debe ser un número entero positivo").run(req),

    next();
}

export const validatePerfumeId = async (req: Request, res: Response, next: NextFunction) => {
  await param('id')
    .isInt().withMessage('ID debe de ser un numero entero')
    .custom(value => value > 0).withMessage('ID no válido').run(req)

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  next();
}