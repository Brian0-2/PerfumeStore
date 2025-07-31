import type { Response } from "express";

type ErrorHandlerProps = { 
    res: Response;
    message: string;
    statusCode: 401 | 403 | 404 | 409 | 500;
}

export const errorHandler = ({res,message,statusCode} : ErrorHandlerProps)  => {
    const error = new Error(message);
    res.status(statusCode).json({ error: error.message });
}