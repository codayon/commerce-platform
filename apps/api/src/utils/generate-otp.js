import { randomInt } from "node:crypto";

const generateOtp = () => {
  const otp = randomInt(100000, 999999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;
  return { otp, otpExpires };
};

export default generateOtp;
