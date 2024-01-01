import { Request, Response, NextFunction } from "express";
import config from "../config/dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
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

// export default authenticationMiddleware;
