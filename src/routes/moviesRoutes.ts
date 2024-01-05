import express, { NextFunction, Request, Response, Router } from "express";
import { movies } from "../controllers";
import {
  authenticationMiddleware,
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/getMovies/:pagenumber", movies.displayMovies);
router.get("/getMovie/:mid", movies.getMovie);
router.get("/country-revenues", movies.countriesRevenue);
router.get("/income-movies", movies.getMoviesIncome);
export default router;
