import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { errorHandler } from "../utils/errorHandler";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user? : User;
        }
    }
}

 const authenticate = async (req : Request , res : Response, next : NextFunction) => {
        const bearer = req.headers.authorization;

        if(!bearer) {
            return errorHandler({res, message: "Unauthorized", statusCode: 401});
        }

        const [,token] = bearer.split(' ')

        if(!token){
            return errorHandler({res, message: "Unvalid token", statusCode: 401});
        }

        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);   
            if(typeof decoded === 'object' && decoded.id){
                req.user = await User.findByPk(decoded.id,{
                    attributes: ['id','name','email']
                })
                next();
            }

            return;
        } catch (error) {
            return errorHandler({res, message: "Server Error", statusCode: 500});
        }
    }

    export default authenticate;