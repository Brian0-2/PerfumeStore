import type { Request, Response, NextFunction } from 'express'
import { param, body } from 'express-validator'
import { errorHandler } from '../../utils/errorHandler'
import { UploadedFile } from 'express-fileupload'
import Perfume from '../../models/Perfume'
import Brand from '../../models/Brand'
import Category from '../../models/Category'
import FraganceType from '../../models/FraganceType'
import Supplier from '../../models/Supplier'

declare global {
  namespace Express {
    interface Request {
      perfume?: Perfume
    }
  }
}

export const validatePerfumeExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id, {
      attributes: ['id', 'name', 'size', 'image_url'],
      include: [
        { model: Brand, attributes: ['id', 'name'] },
        { model: Category, attributes: ['id', 'name'] },
        { model: FraganceType, attributes: ['id', 'name'] },
        { model: Supplier, attributes: ['id', 'name'] }
      ],
    });

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


export const validateImageUpload = (isRequired: boolean = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const imageFile = req.files?.image as UploadedFile;

    if (!imageFile) {
      if (isRequired) {
        return errorHandler({
          res,
          message: "La imagen es obligatoria",
          statusCode: 422
        });
      } else {
        return next();
      }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return errorHandler({
        res,
        message: "Formato de imagen inválido. Solo se permiten JPEG, JPG o PNG",
        statusCode: 422
      });
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (imageFile.size > maxSize) {
      return errorHandler({
        res,
        message: "La imagen no debe superar los 2MB",
        statusCode: 422
      });
    }

    next();
  };
};

export const validatePerfumeId = async (req: Request, res: Response, next: NextFunction) => {
  await param('id')
    .isInt().withMessage('ID debe de ser un numero entero')
    .custom(value => value > 0).withMessage('ID no válido').run(req)

  next();
}