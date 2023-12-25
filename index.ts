import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { config } from "./config/dotenv";
import { getAllMovies } from "./src/logicFetch";
// dotenv.config();

const app = express();

app.use(express.json());

app.get("/fetch-api-data", getAllMovies);
app.listen(config.env.app.port, () => {
  console.log(`Server is running on port ${config.env.app.port}`);
});
