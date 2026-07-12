import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../../../controllers/product.js";

const router = Router();

/**
 * @openapi
 * /product/create-product:
 *   post:
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string, description: Category ID }
 *               stock: { type: number }
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url: { type: string }
 *                     public_id: { type: string }
 *     responses:
 *       201: { description: Product created successfully }
 *       400: { description: A required field is missing }
 *       500: { description: Internal server error }
 */
router.post("/create-product", createProduct);

/**
 * @openapi
 * /product/get-product/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *         description: Product ID
 *     responses:
 *       200: { description: Product fetched successfully }
 *       400: { description: Invalid product ID }
 *       404: { description: Product not found }
 *       500: { description: Internal server error }
 */
router.get("/get-product/:productId", getProduct);

/**
 * @openapi
 * /product/delete-product/{productId}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *         description: Product ID
 *     responses:
 *       200: { description: Product deleted successfully }
 *       400: { description: Invalid product ID }
 *       404: { description: Product not found }
 *       500: { description: Internal server error }
 */
router.delete("/delete-product/:productId", deleteProduct);

/**
 * @openapi
 * /product/update-product/{productId}:
 *   patch:
 *     summary: Update one or more product fields
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string, description: Category ID }
 *               stock: { type: number }
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url: { type: string }
 *                     public_id: { type: string }
 *     responses:
 *       200: { description: Product updated successfully }
 *       400: { description: Invalid product ID or no valid update fields }
 *       404: { description: Product not found }
 *       500: { description: Internal server error }
 */
router.patch("/update-product/:productId", updateProduct);

export default router;
