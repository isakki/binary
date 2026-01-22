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
    entities: [join(__dirname, '../model/entities/*{.ts,.js}')],
    migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false
});

export const initializeDataSource = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("✓ Database connected successfully!");
        }
    } catch (error) {
        console.error("✗ Error connecting to database:", error);
        throw error;
    }
};

export default AppDataSource;
