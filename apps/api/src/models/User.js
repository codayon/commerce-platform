import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      lowercase: true,
      unique: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "That doesn't look like a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      validate: [validator.isStrongPassword, "Password must be strong"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires: Date,
    role: {
      type: String,
      enum: ["customer", "vendor"],
      default: "customer",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = model("User", userSchema);

export default User;
