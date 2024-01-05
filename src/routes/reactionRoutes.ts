import express, { NextFunction, Request, Response, Router } from "express";
import { reaction } from "../controllers";
import {
  authenticationMiddleware,
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get(
  "/getReaction/:mid",
  authCheck,
  checkVerifyEmail,
  reaction.getLikeDislike
);
router.post(
  "/movies-likeDislike/:mid",
  authCheck,
  checkVerifyEmail,
  reaction.LikeDislikeMovies
);
export default router;
