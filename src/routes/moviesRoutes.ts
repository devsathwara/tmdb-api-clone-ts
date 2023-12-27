import express, { NextFunction, Request, Response, Router } from "express";
import * as movies from "../controllers/moviesContoller";
import {
  authenticationMiddleware,
  authCheck,
} from "../middleware/authMiddleware";
const router: Router = express.Router();

router.get("/search-movie-pagenumber/:pagenumber", movies.displayMoviesbyPages);

router.post("/create-favourite-list", authCheck, movies.createFavouriteList);
router.get("/access-favourite-list", authCheck, movies.accessListUser);
export default router;
