import express, { NextFunction, Request, Response } from "express";
import { config } from "./src/config/config";
import {
  moviesRoutes,
  authRoutes,
  chartRoutes,
  commentRoutes,
  ratingsRoutes,
  reactionRoutes,
  favourtieRoutes,
  watchListRoutes,
} from "./src/routes/index";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use("/movies", moviesRoutes.default);
app.use("/user", authRoutes.default);
app.use("/chart", chartRoutes.default);
app.use("/comment", commentRoutes.default);
app.use("/reaction", reactionRoutes.default);
app.use("/ratings", ratingsRoutes.default);
app.use("/favourite", favourtieRoutes.default);
app.use("/watchList", watchListRoutes.default);

export default app;
