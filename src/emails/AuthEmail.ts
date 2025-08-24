import { transport } from "../config/nodemailer";
import pug from "pug";

type EmailType = {
  name: string;
  email: string;
  token: string;
}

export class AuthEmail {

  static app = process.env.APP_NAME;

  static sendConfirmationEmail = async (user: { name: string; email: string; token: string }) => {
    const link = `${process.env.FRONTEND_URL}/auth/new-password/${user.token}`;
    const html = pug.renderFile(__dirname + "/templates/sendConfirmation.pug", {
      name: user.name,
      token: user.token,
      app: AuthEmail.app,
      link
    });

    const email = await transport.sendMail({
      from: `${AuthEmail.app} <ingbvn0@gmail.com>`,
      to: user.email,
      subject: `${AuthEmail.app} - Confirma tu cuenta!`,
      html
    });

    console.log("Email sent: ", email.messageId);
    return email;
  };

  static sendPasswordResetToken = async (user: EmailType) => {
    const link = `${process.env.FRONTEND_URL}/auth/new-password/${user.token}`;
    const html = pug.renderFile(__dirname + "/templates/sendPasswordReset.pug", {
      name: user.name,
      token: user.token,
      app: AuthEmail.app,
      link
    });

    const email = await transport.sendMail({
      from: `${AuthEmail.app} <admin@${AuthEmail.app}.com>`,
      to: user.email,
      subject: `${AuthEmail.app} - Restablece tu contraseña`,
      html
    });

    console.log("Email sent: ", email.messageId);
    return email;
  };
}  