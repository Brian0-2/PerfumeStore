import bcrypt from 'bcrypt';

export  const hashPassword = async (password : string) : Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const checkPassword = async (password : string, hashedPassword : string) : Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const getToken = () : string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const tokenExpires = () : Date => {
    return new Date(Date.now() + 15 * 60 * 1000); // 15 min
}