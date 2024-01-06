import express, { NextFunction, Request, Response, Router } from "express";
import { watchList } from "../controllers";
import {
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get("/share/:id", watchList.accessWatchListpublic);
router.put(
  "/updateWatchListName/:id",
  authCheck,
  watchList.updateWatchlistName
);
router.delete("/deleteWatchList/:id", authCheck, watchList.deleteWatchlist);
router.post(
  "/delete-movies-watchList/:id",
  authCheck,
  watchList.deleteMoviesWatchList
);
router.post("/create-watch-list", authCheck, watchList.createWatchList);
router.post("/insert-watch-list", authCheck, watchList.insertMovieswatchlist);

router.get("/movies-watch-list/:id", authCheck, watchList.getMoviesWatchList);
router.get("/access-watch-list", authCheck, watchList.accessListUser);
export default router;
