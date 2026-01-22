import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || '',
    synchronize: false,
    logging: true,
    entities: [join(__dirname, '/model/entities/**/*.ts')],
    migrations: [join(__dirname, '/migrations/**/*.ts')],
    subscribers: [],
});
