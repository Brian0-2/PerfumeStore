import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export  const hashPassword = async (password : string) : Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const checkPassword = async (password : string, hashedPassword : string) : Promise<boolean> => await bcrypt.compare(password, hashedPassword);

export const getToken = (): string => uuidv4();

export const tokenExpires = () : Date => new Date(Date.now() + 15 * 60 * 1000); // 15 min