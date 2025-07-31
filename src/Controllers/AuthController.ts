import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, getToken, hashPassword } from "../utils/auth";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import { errorHandler } from "../utils/errorHandler";


export class AuthController {

    static createAccount = async (req : Request , res : Response) => {
        try {

            const {email, password} = req.body

            //prevent duplicate email
            const userExist = await User.findOne({where: {email}});
   
            if (userExist) {
                return errorHandler({res, message: "User already exists", statusCode: 409});
            }

            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.token = getToken();

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })

            await user.save();
            res.status(201).json({message : 'Account created successfully'});
            
        } catch (error) {
            res.status(500).json({error : "Error creating an account"});
            return;
        }
    }

    static confirmAccount = async (req : Request , res : Response) => {

        const {token} = req.body ?? req.params;

        //check if token is valid or the id is needed to update the instance
        const user = await User.findOne({where: {token : token}, attributes: ['id','token','confirmed']});

        if (!user) {
           return errorHandler({res, message: "Token is invalid", statusCode: 404});
        }

        await user.update({ confirmed: true, token: null });

        res.status(200).json({message : "Account confirmed successfully"});
        return;
    }

    static login = async (req : Request , res : Response) => {
        const {email, password} = req.body;

        //check if user exists
        const user = await User.findOne({
            where: {
                email
            },
            attributes: ['id','email','password','confirmed']
        });

        if (!user) {
            return errorHandler({res, message: "User not found", statusCode: 404});
        }

        //check if user is confirmed
        if (!user.confirmed) {
            return errorHandler({res, message: "Account not confirmed", statusCode: 403});
        }

        //check if password is correct
        if(! await checkPassword(password, user.password)) {
            return errorHandler({res, message: "Password incorrect", statusCode: 401});
        }

        res.status(200).json(generateJWT(user.id));

        return;
    }

    static forgotPassword = async (req : Request , res : Response) => {
        const {email} = req.body;
        
        //check if user exists
        const user = await User.findOne({where : {
            email
        },
            attributes : ['id','email', 'name','token','confirmed']
        })

        if(!user) {
            return errorHandler({res, message: "User not found", statusCode: 404});
        }

        //check if user is confirmed
        if(!user.confirmed) {
            return errorHandler({res, message: "Account not confirmed", statusCode: 403});
        }

        user.token = getToken();
        await user.save();

        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })
        
        //generate token
        res.status(200).json({message : "Check your email for instructions"});
        return;
    }

    static validateToken = async (req : Request , res : Response) => {
        const {token} = req.body;

        const tokenExist = await User.findOne({
            where: {
                token
            },
            attributes: ['id','token']
        });

        if(!tokenExist) {
            return errorHandler({res, message: "Token not valid", statusCode: 404});
        }

        res.status(200).json({message : "Token valid"});
        return;
    }

    static resetPasswordWithToken = async (req : Request , res : Response) => {
        const {token} = req.params;
        const {password} = req.body;

        //check if token is valid
        const user = await User.findOne({
            where: {
                token
            },
            attributes: ['id','token','confirmed']
        });

        if(!user) {
            return errorHandler({res, message: "Token not valid", statusCode: 404});
        }

        //hash password
        user.password = await hashPassword(password);
        user.token = null;

        await user.save();

        res.status(200).json({message : "Password reset successfully"});
        return;
    }

    static getUser = async (req : Request , res : Response) => {
        res.status(200).json(req.user)
        return;
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const {current_password, new_password} = req.body;
        const {id} = req.user;

        const user = await User.findByPk(id, {
            attributes: ['id', 'email', 'password']
        });

        const isPasswordCorrect = await checkPassword(current_password, user.password);
        if(!isPasswordCorrect) {
            return errorHandler({res, message :"Current Password is not correct",statusCode: 401})
        }

        user.password = await hashPassword(new_password);
        await user.save();

        res.status(200).json({message: "Password updated successfully"});
        return;
    }

        static checkPassword = async (req: Request, res: Response) => {
        const {current_password} = req.body;
        const {id} = req.user;

        const user = await User.findByPk(id, {
            attributes: ['id', 'email', 'password']
        });

        const isPasswordCorrect = await checkPassword(current_password, user.password);
        if(!isPasswordCorrect) {
            return errorHandler({res, message :"Current Password is not correct",statusCode: 401})
        }

        res.status(200).json({message: "Correct Password"});
        return;
    }
   

}