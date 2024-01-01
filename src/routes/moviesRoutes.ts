import express, { NextFunction, Request, Response, Router } from "express";
import * as movies from "../controllers/moviesContoller";
import {
  authenticationMiddleware,
  authCheck,
} from "../middleware/authMiddleware";
const router: Router = express.Router();

router.get("/getMoviesbyPage/:pagenumber", movies.displayMoviesbyPages);

router.post("/create-watch-list", authCheck, movies.createWatchList);
router.post("/insert-watch-list", authCheck, movies.insertMovieswatchlist);
router.get("/access-favourite-list", authCheck, movies.getMoviesFavourties);
router.get("/movies-watch-list", authCheck, movies.getMoviesWatchList);
router.get("/access-watch-list", authCheck, movies.accessListUser);
router.post("/add-favourites", authCheck, movies.insertFavourites);
router.post("/delete-favourites", authCheck, movies.deleteFavourite);
router.post(
  "/delete-movies-watchList",
  authCheck,
  movies.deleteMoviesWatchList
);
router.get("/country-revenues", movies.countriesRevenue);
router.get("/chart-movies/:id", movies.moviesReleasedin3Years);
router.get("/chart-movies", movies.moviesReleasedin3Years);
router.get("/income-movies", movies.getMoviesIncome);
router.get("/watch-list-share/:id", movies.accessWatchListpublic);
export default router;
