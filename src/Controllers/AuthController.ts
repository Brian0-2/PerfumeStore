import type { Request, Response } from "express";
import { Op } from "sequelize";
import { db } from "../config/db";
import { checkPassword, getToken, hashPassword, tokenExpires } from "../utils/auth";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import { errorHandler } from "../utils/errorHandler";
import User from "../models/User";

export class AuthController {

  static createAccount = async (req: Request, res: Response) => {
    const transaction = await db.transaction();

    try {
      const { name, email, phone, address } = req.body;

      const existingUser = await User.findOne({
        where: { [Op.or]: [{ email }, { phone }] },
        transaction
      });

      if (existingUser) {
        await transaction.rollback();
        if (existingUser.email === email) {
          return errorHandler({ res, message: `El usuario con el correo ${existingUser.email} ya existe.`, statusCode: 409 });
        }
        if (existingUser.phone === phone) {
          return errorHandler({ res, message: `El usuario con el celular ${existingUser.phone} ya existe.`, statusCode: 409 });
        }
      }

      const token = getToken();
      const tokenExpiresAt = tokenExpires();

      const user = await User.create({
        name,
        email,
        phone,
        address,
        password: "",
        token,
        tokenExpiresAt,
        confirmed: false,
        role: "client"
      }, { transaction });

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token
      });

      await transaction.commit();

      res.status(201).json({
        message: "Cuenta creada correctamente, tienes 15 minutos para confirmar tu cuenta."
      });

    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return errorHandler({ res, message: "No se pudo crear la cuenta, falló el envío del correo.", statusCode: 500 });
    }
  };

  static validToken = async (req: Request, res: Response) => {
    try {
      res.status(200).json("OK");
    } catch (error) {
      return errorHandler({ res, message: "Error con el token", statusCode: 500 });
    }
  }


  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email
        },
        attributes: ['id', 'email', 'password', 'confirmed']
      });

      if (!user) return errorHandler({ res, message: "Correo o contraseña incorrecta", statusCode: 404 });
      if (!user.confirmed) return errorHandler({ res, message: "Correo o contraseña incorrecta", statusCode: 403 });
      if (!await checkPassword(password, user.password)) return errorHandler({ res, message: "Correo o contraseña incorrecta", statusCode: 401 });

      res.status(200).json(generateJWT(user.id));
    } catch (error) {
      return errorHandler({ res, message: "Error al iniciar sesión", statusCode: 500 });
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({
        where: {
          email
        },
        attributes: ['id', 'email', 'name', 'token','tokenExpiresAt', 'confirmed']
      })

      if (!user) return errorHandler({ res, message: "Usuario no encontrado o cuenta no confirmada", statusCode: 403 });

      user.token = getToken();
      user.tokenExpiresAt = tokenExpires();
      
      await Promise.all([
        user.save(),
        AuthEmail.sendPasswordResetToken({
          name: user.name,
          email: user.email,
          token: user.token
        })
      ]);

      res.status(200).json({ message: "Revisa tu correo para las instrucciones" });
    } catch (error) {
      return errorHandler({ res, message: "Error al solicitar recuperación de cuenta", statusCode: 500 });
    }
  }

  static createUserPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;

      req.user.password = await hashPassword(password);
      req.user.token = null;
      req.user.confirmed = true;
      req.user.tokenExpiresAt = null;
      await req.user.save();

      res.status(200).json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
      return errorHandler({ res, message: "Error al restablecer la contraseña", statusCode: 500 });
    }
  }

  static getUser = async (req: Request, res: Response) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      return errorHandler({ res, message: "Error al obtener usuario", statusCode: 500 });
    }
  }

  static validateTokenUser = async (req: Request, res: Response) => {
    try {
      res.status(200).json({ message: `Estimad@ ${req.user.name}, coloca una contraseña nueva y segura` });
    } catch (error) {
      return errorHandler({ res, message: "Error con el token", statusCode: 500 });
    }
  }

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    try {
      const { current_password, new_password } = req.body;
      const { id } = req.user;

      const user = await User.findByPk(id, {
        attributes: ['id', 'email', 'password']
      });

      if (!await checkPassword(current_password, user.password))
        return errorHandler({ res, message: "La contraseña actual no es correcta", statusCode: 401 });

      user.password = await hashPassword(new_password);
      await user.save();

      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      return errorHandler({ res, message: "Error al actualizar la contraseña", statusCode: 500 });
    }
  }

  static checkPassword = async (req: Request, res: Response) => {
    try {
      const { current_password } = req.body;

      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'email', 'password']
      });

      if (!await checkPassword(current_password, user.password))
        return errorHandler({ res, message: "La contraseña actual no es correcta", statusCode: 401 });

      res.status(200).json({ message: "Contraseña correcta" });
    } catch (error) {
      return errorHandler({ res, message: "Error al verificar la contraseña", statusCode: 500 });
    }
  }
}
