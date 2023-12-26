import * as User from "../models/User";
import { Request, Response } from "express";
import * as Z from "zod";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import j from "../config/jwt";
const emailSchema = Z.string().email({ message: "Invalid Email" });
const passwordSchema = Z.string().min(5, {
  message: "password should be 5 letters or more",
});
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { email, password, username }: any = req.body;
    emailSchema.parse(email);
    passwordSchema.parse(password);
    // hash the password before saving it to database
    password = await bcrypt.hash(password, 10);
    let data: any = {
      username: username,
      email: email,
      password: password,
    };
    const user = await User.registeruser(data);
    if (user) {
      return res.status(201).json({ message: "Successfully created user" });
    } else {
      console.log("Error in creating new user");
      throw new Error("Error in creating new user");
    }
  } catch (error) {
    console.error(error);
  }
};
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    let { email, password } = req.body;
    console.log(password);
    const user = await User.findUser(email);
    console.log(user);
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
    res.clearCookie("token");

    return res
      .status(200)
      .json({ auth: false, token: null, message: "Logout Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
