import { Request, Response, NextFunction } from "express";
import config from "../config/dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUser } from "../models/User";
interface CustomRequest extends Request {
  user?: any;
}
export const authenticationMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ auth: false, message: "No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.env.app.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (ex) {
    console.error(ex);

    if (ex instanceof jwt.TokenExpiredError) {
      res.status(401).json({ auth: false, message: "Token expired." });
      return;
    }

    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};
export const authCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  let cookieemail = req.cookies.email;
  if (!cookieemail) {
    console.log("enter if");
    return res.json({
      message: "Please login first",
    });
  } else {
    next();
  }
};
export const checkVerifyemail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const email = req.body.email;
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
// export default authenticationMiddleware;
