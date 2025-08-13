import { db } from './config/db';
import { corsConfig } from './config/cors';
import express from 'express';
import cors from 'cors';
import colors from 'colors';
import morgan from 'morgan';
import authRouter from './routes/authRouter';
import perfumeRouter from './routes/perfumeRouter';
import customerOrderRouter from './routes/customerOrderRouter';


async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.yellow('Database connected successfully'));
    } catch (error) {
        console.log(colors.red.bold('Database connected failed'));

    }
}

connectDB();

const app = express();

//Permitir cors
app.use(cors(corsConfig))

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/perfume', perfumeRouter);
app.use('/api/customer-order', customerOrderRouter);

export default app;