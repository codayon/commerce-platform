import { Router } from "express";
import { createCategory, getCategory, listCategories } from "../../../controllers/category.js";

const router = Router();

router.post("/create-category", createCategory);

router.get("/get-category/:categoryId", getCategory);

router.get("/list-categories", listCategories);

export default router;
