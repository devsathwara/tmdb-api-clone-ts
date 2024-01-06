import express, { NextFunction, Request, Response, Router } from "express";
import { movies } from "../controllers";
import {
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/getMovies/:pagenumber", movies.display);
router.get("/getMovie/:mid", movies.getMovie);
router.get("/country-revenues", movies.countriesRevenue);
router.get("/income-movies", movies.getMoviesIncome);
export default router;
