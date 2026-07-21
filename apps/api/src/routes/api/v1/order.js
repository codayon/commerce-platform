import { Router } from "express";
import { createOrder, getOrderHistory, getOrderDetails } from "../../../controllers/order.js";
import { protect } from "../../../middlewares/auth.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /order/create-order:
 *   post:
 *     summary: Create an order from the current user's cart
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       201: { description: Order created successfully }
 *       400: { description: Cart is empty or insufficient stock }
 *       401: { description: No active session }
 *       404: { description: A cart product no longer exists }
 */
router.post("/create-order", createOrder);

/**
 * @openapi
 * /order/order-history:
 *   get:
 *     summary: Get the current user's order history
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       200: { description: Order history fetched successfully }
 *       401: { description: No active session }
 */
router.get("/order-history", getOrderHistory);

/**
 * @openapi
 * /order/order-details/{orderId}:
 *   get:
 *     summary: Get details of a specific order
 *     security:
 *       - sessionCookie: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *         description: Order ID
 *     responses:
 *       200: { description: Order details fetched successfully }
 *       400: { description: Invalid order ID }
 *       401: { description: No active session }
 *       404: { description: Order not found }
 */
router.get("/order-details/:orderId", getOrderDetails);

export default router;
