import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth.route";
import mlmRouter from "./routes/mlm.route";
import { routeErrorHandler, unhandledErrorHandler } from "./middleware/exception";
import { initializeDataSource } from "./config/db-config";

require('dotenv').config();

const app: Application = express();
console.log(process.env.PORT);
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection before starting server
const startServer = async () => {
  try {
    await initializeDataSource();
    
    app.use("/auth", authRouter);
    app.use("/mlm", mlmRouter);

    app.use(routeErrorHandler);
    app.use(unhandledErrorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log(`✓ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
