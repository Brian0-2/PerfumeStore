import { corsConfig } from './config/cors';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/authRouter';
import perfumeRouter from './routes/perfumeRouter';
import customerOrderRouter from './routes/customerOrderRouter';
import supplierRouter from './routes/supplierOrderRouter';
import { connectDB } from './config/db';

connectDB();
const app = express();

app.use(cors(corsConfig))
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/perfume', perfumeRouter);
app.use('/api/customer-order', customerOrderRouter);
app.use('/api/supplier-order', supplierRouter);

export default app;