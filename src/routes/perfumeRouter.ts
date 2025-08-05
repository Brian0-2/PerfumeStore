import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";
import { PerfumeController } from "../Controllers/PerfumeController";
import { validatePerfumeExist, validatePerfumeId, validatePerfumeInput } from "../middleware/Perfumes/validatePerfumes";

const perfumeRouter = Router();

perfumeRouter.use(authenticate);

perfumeRouter.get("/", PerfumeController.getAllPerfumes);

perfumeRouter.get("/:id",
  validatePerfumeId,
  validatePerfumeExist,
  PerfumeController.getPerfumeById
);

perfumeRouter.post("/",
  validatePerfumeInput,
  handleInputErrors,
  PerfumeController.createPerfume
);

perfumeRouter.put('/:id',
  validatePerfumeId,
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
