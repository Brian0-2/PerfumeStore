import { transport } from "../config/nodemailer";

type EmailType = {
    name: string;
    email: string;
    token: string;
}

export class AuthEmail {  

    static sendConfirmationEmail = async (user : EmailType) => {
        const email = await transport.sendMail({
            from : "CashTracker <admin@cashtracker.com>",
            to : user.email,
            subject : "CashTracker - Confirm your account",
            html : `
                <p>Hello : ${user.name}, You have created your CashTracker account, it is almost ready.!</p>
                <p>Visit the following link: </p>
                <a href="#">Confirm your account</a>
                <p>Enter the following code: ${user.token}</p>
            `
        })

        console.log("Email sent: ", email.messageId);
    }

     static sendPasswordResetToken = async (user : EmailType) => {
        const email = await transport.sendMail({
            from : "CashTracker <admin@cashtracker.com>",
            to : user.email,
            subject : "CashTracker - Reset your password",
            html : `
                <p>Hello : ${user.name}, you have requested to reset your password.!</p>
                <p>Visit the following link: </p>
                <a href="#">Reset Password</a>
                <p>Enter the following code: <strong>${user.token}</strong></p>
            `
        })

        console.log("Email sent: ", email.messageId);
    }
}  