
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = () => {
    return {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      }
}

export const transport = nodemailer.createTransport(config());