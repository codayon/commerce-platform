import { loadEnvFile } from "node:process";
import nodemailer from "nodemailer";

loadEnvFile();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(email, otp, username) {
  const mailOptions = {
    from: `"User Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Hi ${username}, your OTP is ${otp}. It expires in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

export default sendOtpEmail;
