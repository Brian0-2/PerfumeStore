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

// CREAR CUENTA (solo admin)
authRouter.post(
  "/create-account",
  authenticate,
  validateUserRole("admin"),
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("El correo no es válido"),
  body("phone")
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ min: 10, max: 10 }).withMessage("El teléfono debe tener 10 caracteres"),
  handleInputErrors,
  AuthController.createAccount
);

// VALIDAR INVITACIÓN
authRouter.get(
  "/invite/:token",
  param("token")
    .isLength({ min: 36, max: 36 })
    .withMessage("El token no es válido")
    .notEmpty()
    .withMessage("El token no puede estar vacío"),
  handleInputErrors,
  validateToken,
  AuthController.validToken
);

// ACEPTAR INVITACIÓN / ESTABLECER CONTRASEÑA
authRouter.post(
  '/invite/:token',
  param("token")
    .isLength({ min: 36, max: 36 })
    .withMessage("El token no es válido")
    .notEmpty()
    .withMessage("El token no puede estar vacío"),
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

// LOGIN
authRouter.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("El correo no es válido")
    .notEmpty()
    .withMessage("El correo es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  AuthController.login
);

// OLVIDÉ MI CONTRASEÑA
authRouter.post(
  "/forgot-password",
  body("email")
    .isEmail()
    .withMessage("El correo no es válido")
    .notEmpty()
    .withMessage("El correo es obligatorio"),
  handleInputErrors,
  AuthController.forgotPassword
);

// RESET CONTRASEÑA
authRouter.post(
  "/reset-password/:token",
  param("token")
    .isLength({ min: 36, max: 36 })
    .withMessage("El token no es válido")
    .notEmpty()
    .withMessage("El token no puede estar vacío"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
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

// OBTENER USUARIO AUTENTICADO
authRouter.get("/user", authenticate, AuthController.getUser);

// ACTUALIZAR CONTRASEÑA
authRouter.post(
  "/update-password",
  authenticate,
  body("current_password").notEmpty().withMessage("La contraseña actual es obligatoria"),
  body("new_password")
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener al menos 8 caracteres")
    .notEmpty()
    .withMessage("La nueva contraseña es obligatoria"),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);

// VERIFICAR CONTRASEÑA
authRouter.post(
  "/check-password",
  authenticate,
  body("current_password").notEmpty().withMessage("La contraseña actual es obligatoria"),
  handleInputErrors,
  AuthController.checkPassword
);

export default authRouter;
