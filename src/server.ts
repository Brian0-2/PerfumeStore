import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import { db } from './config/db';
import authRouter from './routes/authRouter';


async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.green('Database connected successfully'));
    } catch (error) {
        console.log(colors.red.bold('Database connected failed'));

    }
}

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRouter);

export default app;