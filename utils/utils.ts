import nodemailer from "nodemailer";
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0cfd44c96fc819",
    pass: "dd7502c689b744",
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
