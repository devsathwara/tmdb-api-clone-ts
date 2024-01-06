import express, { NextFunction, Request, Response, request } from "express";
import { reaction } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";

export async function insert(req: Request, res: Response) {
  try {
    let { type } = req.body;
    const email = req.cookies.email;
    let { mid } = req.params;
    let data: any = {
      mid: parseInt(mid),
      user_email: email,
      reaction: type,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await reaction.insert(data);
    if (result) {
      sendResponse(res, StatusCodes.ACCEPTED, {
        message: `${mid} ${type} by ${email}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
export async function getReaction(req: Request, res: Response) {
  try {
    const { mid } = req.params;
    const result = await reaction.getReaction(mid);
    sendResponse(res, StatusCodes.OK, { reactions: result });
  } catch (error) {
    console.error(error);
  }
}
