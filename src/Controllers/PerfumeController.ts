import type { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import Perfume from "../models/Perfume";

export class PerfumeController {
  static getAllPerfumes = async (req: Request, res: Response) => {
    try {
      const perfumes = await Perfume.findAll({});

      res.status(200).json({ perfumes, user: req.user });
    } catch (error) {
      return errorHandler({ res, message: "Error Getting Perfumes", statusCode: 500 });
    }
  };

  static createPerfume = async (req: Request, res: Response) => {
    try {
      const { supplier_price, to_earn } = req.body;

      await Perfume.create({
        ...req.body,
        price: Number(supplier_price) + Number(to_earn),
      });

      res.status(201).json({ message: "Perfume creado exitosamente" });
    } catch (error) {
      return errorHandler({ res, message: "Error Getting Perfumes", statusCode: 500 });
    }
  };

  static getPerfumeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const perfume = await Perfume.findOne({ where: { id } });

      if (!perfume) return errorHandler({ res, message: "Perfume Not Found", statusCode: 404 });

      res.status(200).json({ perfume });
    } catch (error) {
      return errorHandler({ res, message: "Error Getting Perfume", statusCode: 500 });
    }
  };
}
