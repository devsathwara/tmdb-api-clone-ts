import * as User from "../models/User";
import { NextFunction, Request, Response } from "express";
import * as Z from "zod";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import j from "../config/jwt";
import nodemailer from "nodemailer";
import crypto from "crypto";
const emailSchema = Z.string().email({ message: "Invalid Email" });
const passwordSchema = Z.string().refine(
  (password) => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
    );
  },
  {
    message:
      "Invalid password. It should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
  }
);
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0cfd44c96fc819",
    pass: "dd7502c689b744",
  },
});
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { email, password, username }: any = req.body;
    emailSchema.parse(email);
    passwordSchema.parse(password);
    const userExist = await User.findUser(email);
    if (userExist.length > 0) {
      res.json({
        message: "Your account is already there please Login",
      });
    }
    // hash the password before saving it to database
    password = await bcrypt.hash(password, 10);
    let token = crypto.randomBytes(16).toString("hex");
    let data: any = {
      username: username,
      email: email,
      password: password,
      is_verified: false,
      verify_token: token,
    };
    const user = await User.registeruser(data);
    if (user) {
      //verify email
      const userToken = await User.updateToken(user[0].email, token);
      const info = await transport.sendMail({
        from: '"TMDB 👻" <info@tmdb.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Email Verification Link", // Subject line
        text: `Hello👋,${username} 
        Please verify your email by clicking below link`, // plain text body
        html: `<a>https://localhost:9898/user/verify-email/${token}</a>`, // html body
      });

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
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res
        .status(401)
        .send({ auth: false, token: null, message: "Wrong Password" });
    }
    var token = jwt.sign(
      { email: user.email, password: user.password },
      j.secret,
      { expiresIn: j.expiresIn }
    );
    res.cookie("token", token, { httpOnly: true });
    res.cookie("email", user[0].email, { httpOnly: true });
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
    const { email } = req.body;
    const user = await User.findUser(email);
    console.log(user);
    if (user[0].is_verified == 0) {
      if (user[0].verify_token === token) {
        await User.updateVerifyToken(email, null);
        const info = await transport.sendMail({
          from: '"TMDB 👻" <info@tmdb.com>', // sender address
          to: `${email}`, // list of receivers
          subject: "Welcome🙌🙌", // Subject line
          text: `Hello👋, 
          Welcome to TMDB(The Movie Database)`, // plain text body
        });
        return res.status(200).send({
          message: "Your email is successfully verified you can login now",
        });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Your email is already verified please login" });
    }
  } catch (error) {
    console.error(error);
  }
};
export const checkVerifyemail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const email = req.cookies.email;
    if (!email) {
      const { email } = req.body;
      const user = await User.findUser(email);
      if (user[0].is_verified == 1) {
        next();
      } else {
        return res.json({
          message:
            "Please verify your account verification link has been sent to your email",
        });
      }
    } else {
      const user = await User.findUser(email);
      if (user[0].is_verified == 1) {
        next();
      } else {
        return res.json({
          message:
            "Please verify your account verification link has been sent to your email",
        });
      }
    }
  } catch (error: any) {}
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    // Associate the reset token with the user in the database
    await User.updateResetToken(email, resetToken);

    const resetLink = `http://localhost:9898/user/reset-password/${resetToken}`;
    // Send the reset link to the user's email
    const info = await transport.sendMail({
      from: '"TMDB 👻" <info@tmdb.com>',
      to: email,
      subject: "Password Reset Link",
      text: `Hello👋, click the link below to reset your password: ${resetLink}`,
      html: `<a>${resetLink}</a>`,
    });

    console.log("Password reset link sent: %s", info.messageId);

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
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findUserByResetToken(token);

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(user[0].email, hashedPassword);

    await User.updateResetToken(user[0].email, null);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let cookieemail = req.cookies.email;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findUser(cookieemail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user[0].password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(cookieemail, hashedNewPassword);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
