import { Router } from "express";
import { getProfile } from "../../../controllers/user.js";
import { protect } from "../../../middlewares/auth.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /user/get-profile:
 *   get:
 *     summary: Get the current session status
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       200: { description: User is logged in }
 *       401: { description: No active session }
 */
router.get("/get-profile", getProfile);

export default router;
