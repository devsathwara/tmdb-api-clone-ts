import express, { NextFunction, Request, Response, Router } from "express";
import { reaction } from "../controllers";
import {
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.get(
  "/getReaction/:mid",
  authCheck,
  checkVerifyEmail,
  reaction.getReaction
);
router.post(
  "/movies-likeDislike/:mid",
  authCheck,
  checkVerifyEmail,
  reaction.insert
);
export default router;
