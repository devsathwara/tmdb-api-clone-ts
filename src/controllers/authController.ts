import { User } from "../models/index";
import { NextFunction, Request, Response } from "express";
import * as Z from "zod";
import * as bcrypt from "bcrypt";
import config from "../config/config";
import { sendEmail, createJWTToken, validateJWTToken } from "../../utils/utils";
import { StatusCodes } from "http-status-codes";
import signInValidation from "../../validation/validation";
import sendResponse from "../../utils/responseUtlis";
export const register = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { email, password }: any = signInValidation.parse(req.body);
    let { username } = req.body;
    const userExist = await User.findUser(email);
    if (userExist) {
      sendResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Your account already exist please login",
      });
    }
    // hash the password before saving it to database
    password = await bcrypt.hash(password, 10);
    let token = createJWTToken(
      { email: email, name: username },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    let data: any = {
      username: username,
      email: email,
      password: password,
      is_verified: false,
    };
    const user = await User.register(data);
    if (user) {
      //verify email
      const info = await sendEmail(
        config.env.app.email,
        email,
        "Email Verification Link",
        `Hello👋,${username} 
      Please verify your email by clicking below link`,
        `<a>${config.env.app.appUrl}/user/verify-email/${token}</a>`
      );

      // console.log("Message sent: %s", info.messageId);
      sendResponse(res, StatusCodes.ACCEPTED, {
        message: `Message Sent to ${email} Please verify it`,
      });
    } else {
      console.log("Error in creating new user");
      throw new Error("Error in creating new user");
    }
  } catch (error: any) {
    if (error instanceof Z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }

    console.error(error);
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Internal Server Error",
    });
  }
};
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    let { email, password } = req.body;
    const user = await User.findUser(email);
    if (!user) {
      sendResponse(res, StatusCodes.NON_AUTHORITATIVE_INFORMATION, {
        auth: false,
        token: null,
        message: "Email not found please register",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      sendResponse(res, StatusCodes.NON_AUTHORITATIVE_INFORMATION, {
        auth: false,
        token: null,
        message: "Wrong Password",
      });
    }
    var token = createJWTToken(
      { email: user.email },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: config.env.app.cookieExpiration,
    });
    res.cookie("email", user.email, {
      httpOnly: true,
      expires: config.env.app.cookieExpiration,
    });
    sendResponse(res, StatusCodes.ACCEPTED, {
      auth: true,
      username: user.username,
      message: "Authentication Successfull",
    });
  } catch (error) {
    console.error(error);
  }
};
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = res.clearCookie("token");
    const email = res.clearCookie("email");
    sendResponse(res, StatusCodes.ACCEPTED, {
      auth: false,
      token: null,
      email: null,
      message: "Logout Successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.params;
    const decoded: any = validateJWTToken(token);
    const user = await User.findUser(decoded.email);
    if (decoded.exp <= Date.now() / 1000) {
      sendResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Token has expired",
      });
    }
    if (user.is_verified == 0) {
      await User.updateIsVerified(decoded.email, null);
      const info = await sendEmail(
        config.env.app.email,
        decoded.email,
        "Welcome🙌🙌",
        `Hello👋, 
          Welcome to TMDB(The Movie Database)`,
        ""
      );
      sendResponse(res, StatusCodes.ACCEPTED, {
        message: "Your email is successfully verified you can login now",
      });
    } else {
      sendResponse(res, StatusCodes.CONFLICT, {
        message: "Your email is already verified please login",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findUser(email);
    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, { message: "User not found" });
    }
    console.log(config.env.app.expiresIn);
    const resetToken = createJWTToken(
      { email: email },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    const resetLink = `${config.env.app.appUrl}/user/reset-password/${resetToken}`;
    const info = await sendEmail(
      config.env.app.email,
      email,
      "Password Reset Link",
      `Hello👋, click the link below to reset your password: ${resetLink}`,
      `<a>${resetLink}</a>`
    );
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Password reset link sent to your email",
    });
  } catch (error: any) {
    console.error(error);
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Internal Server Error",
    });
  }
};
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: "Token NOT FOUND",
    });
  }

  try {
    const decoded: any = validateJWTToken(token);

    // Check if the token is expired
    if (decoded.exp <= Date.now() / 1000) {
      sendResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Token has expired",
      });
    }

    // Continue with your password reset logic
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(decoded.email, hashedPassword);

    // await User.updateResetToken(decoded.email, null);

    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Internal Server Error",
    });
  }
};
export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let email = req.cookies.email;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findUser(email);

    if (!user) {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        message: "User Not Found",
      });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      sendResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Current Password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(email, hashedNewPassword);

    sendResponse(res, StatusCodes.ACCEPTED, {
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error(error);
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Internal Server Error",
    });
  }
};
