import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  listProducts,
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

/**
 * @openapi
 * /product/list-products:
 *   get:
 *     summary: List all products (with optional search and filters)
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search query matching name or description
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Category ID to filter by
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Maximum price filter
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Limit of products per page
 *       - in: query
 *         name: sort
 *         schema: { type: string, default: "-createdAt" }
 *         description: Sort field and order (e.g. price, -price, createdAt, -createdAt)
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/list-products", listProducts);

export default router;
