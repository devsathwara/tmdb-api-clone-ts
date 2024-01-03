import express, { NextFunction, Request, Response } from "express";
import { config } from "./src/config/config";
import { getMovieDetails } from "./logicFetch";
import axios from "axios";
import { AxiosResponse } from "axios";
import { createMovies, insertGenre } from "./src/models/Movies";
import movieRoutes from "./src/routes/moviesRoutes";
import userRoutes from "./src/routes/authroutes";
import cookieParser from "cookie-parser";
const TMDB_API_KEY = "e84a72fca7815b41c03fe50eacfa8df6";
let result: any[] = [];
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use("/movies", movieRoutes);
app.use("/user", userRoutes);

// app.get("/fetch-api-data", getAllMovies, (req: Request, res: Response) => {
//   res.json({ message: "Inserted Successfully" });
// });

// app.get("/fetch-genres-movies", getAllGenres, (req: Request, res: Response) => {
//   res.json({ message: "inserted genres" });
// });
app.listen(config.env.app.port, () => {
  console.log(`Server is running on port ${config.env.app.port}`);
});
