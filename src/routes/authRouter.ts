import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../Controllers/AuthController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { limiter } from "../config/limiter";
import authenticate from "../middleware/auth";

const authRouter = Router();

authRouter.use(limiter);

authRouter.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("phone")
    .notEmpty().withMessage('Phone is required')
    .isLength({min: 10, max : 10}).withMessage("Phone is 10 characters required"),
  body("password")
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  handleInputErrors,
  AuthController.createAccount
);

authRouter.post(
  "/confirm-account",
  body("token")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token is not valid")
    .notEmpty()
    .withMessage("Token is not valid"),
  handleInputErrors,
  AuthController.confirmAccount
);

authRouter.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleInputErrors,
  AuthController.login
);

authRouter.post(
  "/forgot-password",
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email is required"),
  handleInputErrors,
  AuthController.forgotPassword
);

authRouter.post(
  "/validate-token",
  body("token")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token is not valid")
    .notEmpty()
    .withMessage("Token is not valid"),
  handleInputErrors,
  AuthController.validateToken
);

authRouter.post(
  "/reset-password/:token",
  param("token")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token is not valid")
    .notEmpty()
    .withMessage("Token is not valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  handleInputErrors,
  AuthController.resetPasswordWithToken
);

authRouter.get("/user", authenticate, AuthController.getUser);

authRouter.post(
  "/update-password",
  authenticate,
  body("current_password").notEmpty().withMessage("Password is required"),
  body("new_password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);

authRouter.post(
  "/check-password",
  authenticate,
  body("current_password").notEmpty().withMessage("Password is required"),
  handleInputErrors,
  AuthController.checkPassword
);

export default authRouter;
