import { Sequelize } from 'sequelize-typescript';
import colors from 'colors';
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

  export async function connectDB() {
      try {
          await db.authenticate();
          db.sync();
          console.log(colors.yellow('Database connected successfully'));
      } catch (error) {
          console.log(colors.red.bold('Database connected failed'));
  
      }
  }
