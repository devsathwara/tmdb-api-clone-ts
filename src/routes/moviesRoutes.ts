import express, { NextFunction, Request, Response, Router } from "express";
import { displayMoviesbyPages } from "../controllers/moviesContoller";
import authenticationMiddleware from "../middleware/authMiddleware";
const router: Router = express.Router();

router.get("/search-movie-pagenumber/:pagenumber", displayMoviesbyPages);

export default router;
