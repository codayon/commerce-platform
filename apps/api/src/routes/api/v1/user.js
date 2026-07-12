import { Router } from "express";
import { getProfile } from "../../../controllers/user.js";
import { protect } from "../../../middlewares/auth.js";

const router = Router();

router.use(protect);

router.get("/get-profile", getProfile);

export default router;
