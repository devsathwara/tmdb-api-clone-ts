import express, { NextFunction, Request, Response } from "express";
import { config } from "./src/config/config";
import movieRoutes from "./src/routes/moviesRoutes";
import userRoutes from "./src/routes/authroutes";
import cookieParser from "cookie-parser";
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
export default app;
