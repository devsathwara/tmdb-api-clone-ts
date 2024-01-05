import { NextFunction, Request, Response } from "express";
export function sendResponse(res: Response, StatusCodes: any, data: any) {
  return res.status(StatusCodes).json(data);
}

export default sendResponse;
