import { Router } from "express";
import { createCategory, getCategory } from "../../../controllers/category.js";

const router = Router();

/**
 * @openapi
 * /category/create-category:
 *   post:
 *     summary: Create a category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               parent: { type: string, description: Parent category ID }
 *     responses:
 *       201: { description: Category created successfully }
 *       400: { description: Name or description is missing }
 *       500: { description: Internal server error }
 */
router.post("/create-category", createCategory);

/**
 * @openapi
 * /category/get-category/{categoryId}:
 *   get:
 *     summary: Get a category and its children
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *         description: Category ID
 *     responses:
 *       200: { description: Category fetched successfully }
 *       404: { description: Category not found }
 *       500: { description: Internal server error }
 */
router.get("/get-category/:categoryId", getCategory);

export default router;
