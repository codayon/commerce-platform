import { Router } from "express";
import authRoutes from "./auth.js";
import cartRoutes from "./cart.js";
import categoryRoutes from "./category.js";
import productRoutes from "./product.js";
import userRoutes from "./user.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/user", userRoutes);

export default router;
