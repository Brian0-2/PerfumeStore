import type { Response } from "express";

type ErrorHandlerProps = { 
  res: Response;
  message: string;
  statusCode: 400 | 401 | 403 | 404 | 422 | 409 | 500;
  errors?: { field?: string; message: string }[];
}

export const errorHandler = ({ res, message, statusCode, errors = [] }: ErrorHandlerProps) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
