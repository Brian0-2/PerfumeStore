import jwt from 'jsonwebtoken';

export const generateJWT = (id: string) : string => {
    //TODO MODIFY TOKEN EXPIRES
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '365d'});
}