import { Router } from "express";
import { createCategory, getCategory } from "../../../controllers/category.js";

const router = Router();

router.post("/create-category", createCategory);
router.get("/get-category/:categoryId", getCategory);

export default router;
