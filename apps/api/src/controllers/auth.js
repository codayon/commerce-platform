import { compare } from "bcryptjs";
import validator from "validator";
import User from "../models/user.js";
import sendOtpEmail from "../utils/email.js";
import generateOtp from "../utils/generate-otp.js";

async function logIn(req, res) {
  try {
    if (req.session.userId) {
      return res.status(400).json({
        success: false,
        message: "You are already logged in",
      });
    }

    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Verify your email before logging in",
      });
    }

    req.session.userId = user._id;
    req.session.email = user.email;

    return res.status(200).json({
      success: true,
      message: "You have successfully logged in",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

function logOut(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({
      success: false,
      message: "You are not logged in",
    });
  }

  req.session.destroy(destroySession);

  function destroySession(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      success: true,
      message: "You have successfully logged out",
    });
  }
}

async function resendOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    const { otp, otpExpires } = generateOtp();
    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save({ validateBeforeSave: false });
    await sendOtpEmail(user.email, user.otp, user.username);

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function signUp(req, res) {
  try {
    const { email, password, username } = req.body;
    const { otp, otpExpires } = generateOtp();

    const user = await User.create({
      email,
      otp,
      otpExpires,
      password,
      username,
    });

    await sendOtpEmail(user.email, user.otp, user.username);

    return res.status(201).json({
      success: true,
      message: "An OTP has been sent to your email",
      data: { user },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { logIn, logOut, resendOtp, signUp, verifyOtp };
