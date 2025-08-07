import type { Request, Response } from "express";
import fs from 'fs-extra'
import { UploadedFile } from 'express-fileupload';
import { errorHandler } from "../utils/errorHandler";
import Perfume from "../models/Perfume";
import { deleteImage, uploadImage } from "../config/cloudinary";

export class PerfumeController {
  static getAllPerfumes = async (req: Request, res: Response) => {
    try {
      const perfumes = await Perfume.findAll({});
      res.status(200).json({ perfumes });
    } catch (error) {
      return errorHandler({ res, message: "Error Getting Perfumes", statusCode: 500 });
    }
  };

  static createPerfume = async (req: Request, res: Response) => {
    try {
      const { supplier_price, to_earn } = req.body;

      const perfume = new Perfume({
        ...req.body,
        price: Number(supplier_price) + Number(to_earn)
      });

      const file = req.files.image as UploadedFile;
      const result = await uploadImage(file.tempFilePath);

      perfume.imageUrl = result.secure_url;
      perfume.imageId = result.public_id

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
        const oldImageId = req.perfume.imageId;
        const result = await uploadImage(file.tempFilePath);

        await Promise.all([
          fs.unlink(file.tempFilePath),
          deleteImage(oldImageId)
        ]);

        updatedFields.imageUrl = result.secure_url;
        updatedFields.imageId = result.public_id;
      }

      await req.perfume.update(updatedFields);

      res.status(200).json({ message: `Perfume ${req.perfume.name} was updated` });
    } catch (error) {
      return errorHandler({ res, message: "Error Updating perfume", statusCode: 500 });
    }
  };

  static deletePerfumeById = async (req: Request, res: Response) => {
    try {
      await Promise.all([deleteImage(req.perfume.imageId), req.perfume.destroy()]);
      res.status(200).json({ message: `Perfume ${req.perfume.name} was deleted` });
    } catch (error) {
      return errorHandler({ res, message: "Error Deleting perfume", statusCode: 500 });
    }
  }
}
