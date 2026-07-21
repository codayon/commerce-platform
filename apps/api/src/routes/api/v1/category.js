import { Router } from "express";
import { createCategory, getCategory, listCategories } from "../../../controllers/category.js";

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

/**
 * @openapi
 * /category/list-categories:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Categories listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       name: { type: string }
 *                       description: { type: string }
 *                       parent: { type: string, nullable: true }
 *       500: { description: Internal server error }
 */
router.get("/list-categories", listCategories);

export default router;
