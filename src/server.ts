import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/authRouter';
import perfumeRouter from './routes/perfumeRouter';
import orderRouter from './routes/orderRouter';
import supplierRouter from './routes/supplierOrderRouter';
import paymentRouter from './routes/paymentRouter';
import customerRouter from './routes/customerRouter';

connectDB();
const app = express();

app.use(cors(corsConfig))
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/perfume', perfumeRouter);
app.use('/api/order', orderRouter);
app.use('/api/supplier-order', supplierRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/customer', customerRouter);



export default app;