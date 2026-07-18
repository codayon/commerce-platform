import { compare } from "bcryptjs";
import validator from "validator";
import User from "../models/user.js";
import sendOtpEmail from "../utils/email.js";
import generateOtp from "../utils/generate-otp.js";

async function logIn(req, res, next) {
  try {
    if (req.session.userId) {
      return res.status(400).json({
        success: false,
        message: "You are already logged in",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
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
    return next(err);
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

async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email format",
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
    return next(err);
  }
}

async function signUp(req, res, next) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and username are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser?.isVerified) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(409).json({
        success: false,
        message: `${field} is already in use`,
      });
    }

    const { otp, otpExpires } = generateOtp();
    let user = existingUser;
    let status = 201;

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save({ validateBeforeSave: false });
      status = 200;
    } else {
      user = await User.create({
        email,
        otp,
        otpExpires,
        password,
        username,
      });
    }

    try {
      await sendOtpEmail(user.email, user.otp, user.username);
    } catch (err) {
      const emailError = new Error("Unable to send the verification email");
      emailError.status = 503;
      emailError.originalError = err;
      return next(emailError);
    }

    return res.status(status).json({
      success: true,
      message: "An OTP has been sent to your email",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or OTP",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or OTP",
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
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
    return next(err);
  }
}

export { logIn, logOut, resendOtp, signUp, verifyOtp };
