import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../Controllers/AuthController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { limiter } from "../config/limiter";
import { validateUserRole } from "../middleware/validateUserRole";
import { validateToken } from "../middleware/validateToken";
import authenticate from "../middleware/auth";

const authRouter = Router();
authRouter.use(limiter(5));

//AUTHENTICATE AND AUTHORIZE
authRouter.post(
  "/create-account",
  authenticate,
  validateUserRole("admin"),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is not valid"),
  body("phone")
    .notEmpty().withMessage('Phone is required')
    .isLength({ min: 10, max: 10 }).withMessage("Phone is 10 characters required"),
  handleInputErrors,
  AuthController.createAccount
);

authRouter.get(
  "/invite/:token",
  param("token")
    .isLength({ min: 36, max: 36 })
    .withMessage("Token is not valid")
    .notEmpty()
    .withMessage("Token is not valid"),
  handleInputErrors,
  validateToken,
  AuthController.validToken
);

authRouter.post('/invite/:token',
  param("token")
    .isLength({ min: 36, max: 36 })
    .withMessage("Token is not valid")
    .notEmpty()
    .withMessage("Token is not valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),
  handleInputErrors,
  validateToken,
  AuthController.setPassword
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
  "/reset-password/:token",
  param("token")
    .isLength({ min: 36, max: 36 })
    .withMessage("Token is not valid")
    .notEmpty()
    .withMessage("Token is not valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),
  handleInputErrors,
  validateToken,
  AuthController.resetPasswordWithToken
);

//AUTHENTICATE
authRouter.get("/user", authenticate, AuthController.getUser);

//AUTHENTICATE
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
