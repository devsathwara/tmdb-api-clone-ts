import nodemailer from "nodemailer";
import config from "../src/config/config";
import jwt from "jsonwebtoken";
const secret = config.env.app.secret;
var transport = nodemailer.createTransport({
  host: config.env.app.emailHost,
  port: 2525,
  auth: {
    user: config.env.app.emailUser,
    pass: config.env.app.emailPass,
  },
});
export async function sendEmail(
  fromEmail: any,
  toEmail: any,
  subject: any,
  text: any,
  html: any
) {
  const info = await transport.sendMail({
    from: `${fromEmail}`, // sender address
    to: `${toEmail}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `${text}`, // plain text body
    html: `${html}`, // html body
  });
}

export function createJWTToken(data: any, expiresIn: any) {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }

  return jwt.sign(data, secret, { expiresIn: expiresIn });
}

export function validateJWTToken(token: any) {
  if (!secret) {
    throw new Error("JWT Secret is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.log(err);
  }
}
