import { Router } from "express";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { PerfumeController } from "../Controllers/PerfumeController";
import { validateImageUpload, validatePerfumeExist, validatePerfumeId, validatePerfumeInput } from "../middleware/Perfumes/validatePerfumes";
import { validateUserRole } from "../middleware/validateUserRole";
import authenticate from "../middleware/auth";
import fileUpload from 'express-fileupload';

const perfumeRouter = Router();
perfumeRouter.use(authenticate,validateUserRole('admin'));

perfumeRouter.get("/", PerfumeController.getAllPerfumes);

perfumeRouter.get("/:id",
  validatePerfumeId,
  validatePerfumeExist,
  PerfumeController.getPerfumeById
);

perfumeRouter.post("/",
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
  }),
  validateImageUpload(true),
  validatePerfumeInput,
  handleInputErrors,
  PerfumeController.createPerfume
);

perfumeRouter.put('/:id',
  validatePerfumeId,
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
  }),
  validateImageUpload(false),
  validatePerfumeExist,
  validatePerfumeInput,
  handleInputErrors,
  PerfumeController.updatePerfumeById
)

perfumeRouter.delete('/:id',
  validatePerfumeId,
  validatePerfumeExist,
  handleInputErrors,
  PerfumeController.deletePerfumeById
)

export default perfumeRouter;
