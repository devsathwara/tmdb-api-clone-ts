import express, { NextFunction, Request, Response, Router } from "express";
import { comment } from "../controllers";
import {
  authenticationMiddleware,
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();
router.post(
  "/comment-movies/:mid",
  authCheck,
  checkVerifyEmail,
  comment.CommentMovies
);
router.post(
  "/reply-comment-movies/:mid/:cid",
  authCheck,
  checkVerifyEmail,
  comment.ReplyCommentMovies
);
router.get(
  "/getComments/:mid",
  authCheck,
  checkVerifyEmail,
  comment.getAllComments
);
export default router;
