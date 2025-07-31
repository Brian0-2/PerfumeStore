import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Sequelize({
    database: process.env.DB_DATABASE,
    dialect: 'mysql',
    logging: false,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + '/../models/**/*'],
  });
