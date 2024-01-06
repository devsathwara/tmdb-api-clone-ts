import express, { NextFunction, Request, Response, request } from "express";
import { comment } from "../models/index";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseUtlis";
export async function insertComment(req: Request, res: Response) {
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
    const result = await comment.insert(data);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "The comment was added successfully",
    });
  } catch (error) {
    console.error(error);
  }
}
export async function insertReply(req: Request, res: Response) {
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
    const result = await comment.insert(data);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Reply  comment was added successfully",
    });
  } catch (error) {
    console.error(error);
  }
}
export async function getComments(req: Request, res: Response) {
  try {
    const { mid } = req.params;
    const comments = await comment.getComments(mid);
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
