import * as User from "../models/User";
import { NextFunction, Request, Response } from "express";
import * as Z from "zod";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendEmail, createJWTToken, validateJWTToken } from "../../utils/utils";
import { jwtDecode } from "jwt-decode";
import signInValidation from "../../validation/validation";

// const registerSchema = {
//   emailSchema: Z.string().email({ message: "Invalid Email" }),
//   passwordSchema: Z.string().refine(
//     (password) => {
//       return (
//         password.length >= 8 &&
//         /[a-z]/.test(password) &&
//         /[A-Z]/.test(password) &&
//         /\d/.test(password) &&
//         /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
//       );
//     },
//     {
//       message:
//         "Invalid password. It should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
//     }
//   ),
// };
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { email, password }: any = signInValidation.parse(req.body);
    let { username } = req.body;
    const userExist = await User.findUser(email);
    if (userExist) {
      res.json({
        message: "Your account is already there please Login",
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
    const user = await User.registerUser(data);
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
      return res
        .status(201)
        .json({ message: `Message Sent to ${email} Please verify it` });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    let { email, password } = req.body;
    const user = await User.findUser(email);
    if (!user) {
      return res
        .status(401)
        .send({ auth: false, token: null, message: "Email not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .send({ auth: false, token: null, message: "Wrong Password" });
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
    return res.status(200).send({
      auth: true,
      username: user.username,
      message: "Authentication Successfull",
    });
  } catch (error) {
    console.error(error);
  }
};
export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = res.clearCookie("token");
    const email = res.clearCookie("email");
    if (!token) {
      return res
        .status(404)
        .send({ auth: false, message: "No token provided" });
    }
    return res.status(200).json({
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
      return res.status(401).json({ message: "Token has expired" });
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
      return res.status(200).send({
        message: "Your email is successfully verified you can login now",
      });
    } else {
      return res
        .status(200)
        .json({ message: "Your email is already verified please login" });
    }
  } catch (error) {
    console.error(error);
  }
};

// In your userController.ts or a separate passwordController.ts file

// ... (previous code)

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findUser(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(config.env.app.expiresIn);
    const resetToken = createJWTToken(
      { email: email },
      `${parseInt(config.env.app.expiresIn)}h`
    );
    // Associate the reset token with the user in the database
    // await User.updateResetToken(email, resetToken);

    const resetLink = `${config.env.app.appUrl}/user/reset-password/${resetToken}`;
    // Send the reset link to the user's email
    const info = await sendEmail(
      config.env.app.email,
      email,
      "Password Reset Link",
      `Hello👋, click the link below to reset your password: ${resetLink}`,
      `<a>${resetLink}</a>`
    );
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return res.status(404).json({ message: "Token not provided" });
  }

  try {
    const decoded: any = validateJWTToken(token);

    // Check if the token is expired
    if (decoded.exp <= Date.now() / 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }

    // Continue with your password reset logic
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(decoded.email, hashedPassword);

    // await User.updateResetToken(decoded.email, null);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(email, hashedNewPassword);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
