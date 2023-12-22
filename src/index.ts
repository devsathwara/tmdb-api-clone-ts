import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { config } from "../config/dotenv";

// dotenv.config();

const app = express();

app.use(express.json());

app.listen(config.env.app.port, () => {
  console.log(`Server is running on port ${config.env.app.port}`);
});
