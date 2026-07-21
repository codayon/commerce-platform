import { Router } from "express";
import { paymentWebhook } from "../../../controllers/payment.js";

const router = Router();

/**
 * @openapi
 * /payment/webhook:
 *   post:
 *     summary: Receive a payment provider webhook
 *     description: >
 *       Verifies an HMAC-SHA256 signature sent in the `x-payment-signature`
 *       header against PAYMENT_WEBHOOK_SECRET, then updates the linked order
 *       and payment. On success the order is marked paid; on failure the
 *       reserved stock is released and the order is cancelled.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, status]
 *             properties:
 *               orderId: { type: string, description: Order ID }
 *               status: { type: string, enum: [succeeded, failed] }
 *               transactionId: { type: string }
 *     responses:
 *       200: { description: Webhook processed successfully }
 *       400: { description: Invalid order ID or payment status }
 *       401: { description: Invalid webhook signature }
 *       404: { description: Order or payment not found }
 *       500: { description: Webhook secret not configured }
 */
router.post("/webhook", paymentWebhook);

export default router;
