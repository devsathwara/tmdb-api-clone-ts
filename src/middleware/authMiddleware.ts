import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUser } from "../models/User";
import { validateJWTToken } from "../../utils/utils";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";

interface CustomRequest extends Request {
  user?: any;
}
export const authCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  let email = req.cookies.email;
  const token = req.cookies.token;
  const decoded:any = validateJWTToken(token) as JwtPayload;
  if (decoded.exp <= Date.now() / 1000) {
    sendResponse(res,StatusCodes.UNAUTHORIZED,{ message: "Token has expired" })
  }
  if (!email) {
    sendResponse(res,StatusCodes.UNAUTHORIZED,{
      message: "Please login first",
    })
  } else {
    next();
  }
};
export const checkVerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const email = req.cookies.email;
    const token = req.cookies.token;
    const decoded:any = validateJWTToken(token) as JwtPayload;
    if (decoded.exp <= Date.now() / 1000) {
      sendResponse(res,StatusCodes.UNAUTHORIZED,{ message: "Token has expired" })
    }
    if (email) {
      const user = await findUser(email);
      if (user.is_verified == 1) {
        next();
      } else {
        return res.json({
          message:
            "Please verify your account verification link has been sent to your email",
        });
      }
    }
  } catch (error: any) {
    console.error(error);
  }
};
