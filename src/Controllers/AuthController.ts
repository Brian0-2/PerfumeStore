import { type Request, type Response } from "express";
import { Op, where } from "sequelize";

import { checkPassword, getToken, hashPassword, tokenExpires } from "../utils/auth";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import { errorHandler } from "../utils/errorHandler";
import User from "../models/User";
import { handleInputErrors } from "../middleware/handleInputErrors";


export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { name, email, phone, address } = req.body;

            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { phone }
                    ]
                }
            });

            if (existingUser) {
                if (existingUser.email === email) {
                    return errorHandler({ res, message: `Usuario con el Correo ${existingUser.email} ya existe.`, statusCode: 409 });
                }
                if (existingUser.phone === phone) {
                    return errorHandler({ res, message: `Usuario con el Celular ${existingUser.phone} ya existe.`, statusCode: 409 });
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
            });

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });

            res.status(201).json({
                message: "Cuenta creada correctamente, Avisa al usuario que tiene 15min para confirmar su cuenta."
            });

        } catch (error) {
            console.log(error);
            return errorHandler({ res, message: "Error Creating Account", statusCode: 500 });
        }
    };


    //TODO
    static createUserPassword = async (req: Request, res: Response) => {
        try {
            const { token } = req.body ?? req.params;
            const { password } = req.body;

            const user = await User.findOne({
                where: {
                    token
                },
                attributes: ['id', 'token', 'tokenExpiresAt', 'confirmed', 'password']
            })

            if (!user) {
                return errorHandler({ res, message: "Token not valid", statusCode: 404 });
            }

            if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) {
                return errorHandler({ res, message: "Token expired", statusCode: 400 });
            }

            user.password = await hashPassword(password);
            user.token = null;
            user.tokenExpiresAt = null;
            user.confirmed = true;

            await user.save();

            res.status(200).json({ message: "Password added successfully" });

        } catch (error) {
            console.log(error);
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            //check if user exists
            const user = await User.findOne({
                where: {
                    email
                },
                attributes: ['id', 'email', 'password', 'confirmed']
            });

            if (!user) return errorHandler({ res, message: "User not found", statusCode: 404 });

            //check if user is confirmed
            if (!user.confirmed) return errorHandler({ res, message: "Account not confirmed", statusCode: 403 });

            //check if password is correct
            if (! await checkPassword(password, user.password)) return errorHandler({ res, message: "Password incorrect", statusCode: 401 });

            res.status(200).json(generateJWT(user.id));
        } catch (error) {
            return errorHandler({ res, message: "Error Login Account", statusCode: 500 });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //check if user exists
            const user = await User.findOne({
                where: {
                    email
                },
                attributes: ['id', 'email', 'name', 'token', 'confirmed']
            })

            if (!user) return errorHandler({ res, message: "User not found", statusCode: 404 });

            //check if user is confirmed
            if (!user.confirmed) return errorHandler({ res, message: "Account not confirmed", statusCode: 403 });

            user.token = getToken();
            await Promise.all([
                user.save(),
                AuthEmail.sendPasswordResetToken({
                    name: user.name,
                    email: user.email,
                    token: user.token
                })
            ]);

            //generate token
            res.status(200).json({ message: "Check your email for instructions" });
        } catch (error) {
            return errorHandler({ res, message: "Error Forgot Account", statusCode: 500 });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExist = await User.findOne({
                where: {
                    token
                },
                attributes: ['id', 'token']
            });

            if (!tokenExist) return errorHandler({ res, message: "Token not valid", statusCode: 404 });

            res.status(200).json({ message: "Token valid" });
        } catch (error) {
            return errorHandler({ res, message: "Error Validating Token", statusCode: 500 });
        }
    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const user = await User.findOne({
                where: {
                    token
                },
                attributes: ['id', 'token', 'confirmed']
            });

            if (!user) 
                return errorHandler({ res, message: "Token not valid", statusCode: 404 });
            if (!user.tokenExpiresAt || user.tokenExpiresAt < new Date()) 
                return errorHandler({ res, message: "Token expired", statusCode: 400 });
            
            user.password = await hashPassword(password);
            user.token = null;
            user.tokenExpiresAt = null;
            await user.save();

            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            return errorHandler({ res, message: "Error Reseting Password", statusCode: 500 });
        }
    }

    static getUser = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.user);
        } catch (error) {
            return errorHandler({ res, message: "Error Getting User", statusCode: 500 });
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        try {
            const { current_password, new_password } = req.body;
            const { id } = req.user;

            const user = await User.findByPk(id, {
                attributes: ['id', 'email', 'password']
            });

            const isPasswordCorrect = await checkPassword(current_password, user.password);
            if (!isPasswordCorrect) return errorHandler({ res, message: "Current Password is not correct", statusCode: 401 });

            user.password = await hashPassword(new_password);
            await user.save();

            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            return errorHandler({ res, message: "Error Updating User Password", statusCode: 500 });
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        try {
            const { current_password } = req.body;
            const { id } = req.user;

            const user = await User.findByPk(id, {
                attributes: ['id', 'email', 'password']
            });

            const isPasswordCorrect = await checkPassword(current_password, user.password);
            if (!isPasswordCorrect) return errorHandler({ res, message: "Current Password is not correct", statusCode: 401 });

            res.status(200).json({ message: "Correct Password" });
        } catch (error) {
            return errorHandler({ res, message: "Error Checking Password", statusCode: 500 });
        }
    }
}