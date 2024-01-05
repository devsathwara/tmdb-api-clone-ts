import express, { NextFunction, Request, Response, request } from "express";
import { comment } from "../models/index";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseUtlis";
export async function CommentMovies(req: Request, res: Response) {
  try {
    const email = req.cookies.email;
    let { mid } = req.params;
    let { comments } = req.body;
    let data: any = {
      movie_id: mid,
      user_email: email,
      comment: comments,
      parent_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await comment.CommentMovies(data);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "The comment was added successfully",
    });
  } catch (error) {
    console.error(error);
  }
}
export async function ReplyCommentMovies(req: Request, res: Response) {
  try {
    const email = req.cookies.email;
    let { mid, cid } = req.params;
    let { comments } = req.body;
    let data: any = {
      movie_id: mid,
      user_email: email,
      comment: comments,
      parent_id: cid,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await comment.CommentMovies(data);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Reply  comment was added successfully",
    });
  } catch (error) {
    console.error(error);
  }
}
export async function getAllComments(req: Request, res: Response) {
  try {
    const { mid } = req.params;
    const comments = await comment.getCommentsAndReplies(mid);
    if (!comments || !Array.isArray(comments)) {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        message: "No Comments Found",
      });
    } else {
      sendResponse(res, StatusCodes.OK, comments);
    }
  } catch (error) {
    console.error(error);
  }
}
