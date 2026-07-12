import bcrypt from "bcryptjs";
import generateOtp from "../utils/generate-otp.js";
import sendOtpEmail from "../utils/email.js";
import User from "../models/User.js";
import validator from "validator";

const logIn = async (req, res) => {
  try {
    if (req.session.userId) {
      return res.status(400).json({
        success: false,
        message: "You are already logged in",
      });
    }

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill up both fields",
      });
    }

    email = email.trim().toLowerCase();

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

    const isMatch = await bcrypt.compare(password, user.password);

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

    res.status(200).json({
      success: true,
      message: "You have successfully logged in",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: true,
      message: "Internal server error",
    });
  }
};

const logOut = (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({
      success: false,
      message: "You are not logged in",
    });
  }

  req.session.destroy((err) => {
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
  });
};

const resendOtp = async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: true,
      message: "Internal server error",
    });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const { otp, otpExpires } = generateOtp();

    const newUser = new User({
      email,
      otp,
      otpExpires,
      password,
      username,
    });

    await newUser.save();

    await sendOtpEmail(newUser.email, newUser.otp, newUser.username);

    res.status(201).json({
      success: true,
      message: "An OTP has been sent to your email",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
    });

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

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { logIn, logOut, resendOtp, signUp, verifyOtp };
