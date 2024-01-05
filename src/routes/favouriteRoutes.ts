import express, { NextFunction, Request, Response, Router } from "express";
import { favourite } from "../controllers";
import {
  authenticationMiddleware,
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();

router.post("/add-favourites", authCheck, favourite.insert);
router.post("/delete-favourites", authCheck, favourite.deleteFavourite);
router.get("/access-favourite-list", authCheck, favourite.getMoviesFavourties);
export default router;
