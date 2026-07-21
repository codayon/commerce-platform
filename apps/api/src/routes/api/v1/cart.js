import { Router } from "express";
import { getCart, addItem, removeItem } from "../../../controllers/cart.js";
import { protect } from "../../../middlewares/auth.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /cart/get-cart:
 *   get:
 *     summary: Get the current user's cart
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       401:
 *         description: No active session
 */
router.get("/get-cart", getCart);

/**
 * @openapi
 * /cart/add-item:
 *   post:
 *     summary: Add an item to the cart (or increment its quantity)
 *     security:
 *       - sessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product]
 *             properties:
 *               product: { type: string, description: Product ID }
 *               quantity: { type: integer, default: 1, minimum: 1 }
 *     responses:
 *       200: { description: Item added to cart }
 *       400: { description: Invalid input }
 *       401: { description: No active session }
 *       404: { description: Product not found }
 */
router.post("/add-item", addItem);

/**
 * @openapi
 * /cart/remove-item/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     security:
 *       - sessionCookie: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *         description: Product ID to remove
 *     responses:
 *       200: { description: Item removed from cart }
 *       400: { description: Invalid product ID }
 *       401: { description: No active session }
 *       404: { description: Cart or item not found }
 */
router.delete("/remove-item/:productId", removeItem);

export default router;
