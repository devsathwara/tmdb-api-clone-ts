import express, { NextFunction, Request, Response, Router } from "express";
import { ratings } from "../controllers";
import {
  authenticationMiddleware,
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/genre-Ratings", ratings.GenreRatings);

router.post("/movies-Ratings/:mid", checkVerifyEmail, ratings.RatingsMovies);
export default router;
