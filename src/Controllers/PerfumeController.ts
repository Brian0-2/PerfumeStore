import type { Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import { errorHandler } from "../utils/errorHandler";
import { deleteImage, uploadImage } from "../config/cloudinary";
import Perfume from "../models/Perfume";
import fs from 'fs-extra';
import { paginate } from "../utils/paginate";
import Brand from "../models/Brand";
import Category from "../models/Category";
import FraganceType from "../models/FraganceType";
import Supplier from "../models/Supplier";


export class PerfumeController {
  static getAllPerfumes = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 10;

      const result = await paginate(Perfume, {
        page,
        perPage,
        attributes: ['id', 'name', 'size', 'image_url'],
        include: [
          { model: Brand, attributes: ['id', 'name'] },
          { model: Category, attributes: ['id', 'name'] },
          { model: FraganceType, attributes: ['id', 'name'] },
          { model: Supplier, attributes: ['id', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return errorHandler({ res, message: "Error Getting Perfumes", statusCode: 500 });
    }
  };

  static createPerfume = async (req: Request, res: Response) => {
    try {
      const perfume = new Perfume(req.body);

      const file = req.files.image as UploadedFile;
      const result = await uploadImage(file.tempFilePath);

      perfume.image_url = result.secure_url;
      perfume.image_id = result.public_id;

      await Promise.all([fs.unlink(file.tempFilePath), perfume.save()]);

      res.status(201).json({ message: "Perfume creado exitosamente" });
    } catch (error) {
      return errorHandler({ res, message: "Error Getting Perfumes", statusCode: 500 });
    }
  };

  static getPerfumeById = async (req: Request, res: Response) => {
    try {
      res.status(200).json(req.perfume);
    } catch (error) {
      return errorHandler({ res, message: "Error Getting Perfume", statusCode: 500 });
    }
  };

  static updatePerfumeById = async (req: Request, res: Response) => {
    try {
      const { supplier_price, to_earn, ...body } = req.body;

      const updatedFields: Perfume = {
        ...body,
        price: Number(supplier_price) + Number(to_earn),
      };

      if (req.files?.image) {

        const file = req.files.image as UploadedFile;
        const oldImageId = req.perfume.image_id;
        const result = await uploadImage(file.tempFilePath);

        await Promise.all([
          fs.unlink(file.tempFilePath),
          deleteImage(oldImageId)
        ]);

        updatedFields.image_url = result.secure_url;
        updatedFields.image_id = result.public_id;
      }

      await req.perfume.update(updatedFields);

      res.status(200).json({ message: `Perfume ${req.perfume.name} was updated` });
    } catch (error) {
      return errorHandler({ res, message: "Error Updating perfume", statusCode: 500 });
    }
  };

  static deletePerfumeById = async (req: Request, res: Response) => {
    try {
      await Promise.all([deleteImage(req.perfume.image_id), req.perfume.destroy()]);
      res.status(200).json({ message: `Perfume ${req.perfume.name} was deleted` });
    } catch (error) {
      return errorHandler({ res, message: "Error Deleting perfume", statusCode: 500 });
    }
  }
}
