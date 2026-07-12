import { Router } from "express";
import { logIn, logOut, resendOtp, signUp, verifyOtp } from "../../../controllers/auth.js";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Logged in successfully }
 *       400: { description: Missing credentials or already logged in }
 *       401: { description: Invalid credentials, email, or unverified account }
 *       404: { description: User not found }
 */
router.post("/login", logIn);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out the current session
 *     responses:
 *       200: { description: Logged out successfully }
 *       400: { description: No active session }
 *       500: { description: Failed to destroy session }
 */
router.post("/logout", logOut);

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: Send a new email verification OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: OTP sent }
 *       400: { description: Email missing or account already verified }
 *       404: { description: User not found }
 *       500: { description: Internal server error }
 */
router.post("/resend-otp", resendOtp);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create an account and send an OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       201: { description: Account created and OTP sent }
 *       500: { description: Internal server error }
 */
router.post("/signup", signUp);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify an account email with an OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, format: email }
 *               otp: { type: string }
 *     responses:
 *       200: { description: Email verified successfully }
 *       400: { description: Invalid or expired OTP }
 *       500: { description: Internal server error }
 */
router.post("/verify-otp", verifyOtp);

export default router;
