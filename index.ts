import express, { NextFunction, Request, Response } from "express";
import { config } from "./src/config/dotenv";
import { getMovieDetails } from "./src/logicFetch";
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
async function getAllMovies(next: NextFunction): Promise<void> {
  try {
    let currentPage = 1;

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?page=${currentPage}&api_key=${TMDB_API_KEY}`
        );

        const pageMovies: any = response.data.results;
        if (pageMovies.length === 0) {
          break;
        }

        const promiseMovie = pageMovies.map(async (movie: any) => {
          const details = await getMovieDetails(movie.id);
          // console.log(details?.countries);
          result.push({
            mid: movie.id,
            adult: movie.adult,
            backdrop_path: movie.backdrop_path,
            genre_ids: JSON.stringify(movie.genre_ids),
            original_language: movie.original_language,
            original_title: movie.original_title,
            overview: movie.overview,
            popularity: movie.popularity,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
            video: movie.video,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            external_ids: JSON.stringify(details?.external_ids),
            status: details?.status,
            revenue: details?.revenue,
            runtime: details?.runtime,
            budget: details?.budget,
            countries: details?.countries,
          });
        });
        await Promise.allSettled(promiseMovie);
        await createMovies(result); // Call createMovies function here
        result = [];
        console.log("Total Records:", currentPage * 20);
        currentPage++;
      } catch (sqlError: any) {
        console.error("SQL Error:", sqlError.message);
        console.error("SQL Error Code:", sqlError.code);
        console.error("SQL Error Number:", sqlError.errno);
        console.error("SQL State:", sqlError.sqlState);
        // console.error("SQL Query:", sqlError.sql);
      }
    }
  } catch (error: any) {
    console.error("An unexpected error occurred: ", error.message);
  }
}
async function getAllGenres(next: NextFunction): Promise<void> {
  try {
    const response: AxiosResponse = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${TMDB_API_KEY}`
    );
    const genres = response.data.genres;
    const insertData = await insertGenre(genres);
    next;
    // if (insertData) {
    //   next;
    // }
    // console.log(genres);
  } catch (error: any) {
    console.error(error);
  }
}
app.get("/fetch-api-data", getAllMovies, (req: Request, res: Response) => {
  res.json({ message: "Inserted Successfully" });
});

app.get("/fetch-genres-movies", getAllGenres, (req: Request, res: Response) => {
  res.json({ message: "inserted genres" });
});
app.listen(config.env.app.port, () => {
  console.log(`Server is running on port ${config.env.app.port}`);
});
