import { Router } from "express";
import { createOrder, getOrderHistory, getOrderDetails } from "../../../controllers/order.js";
import { protect } from "../../../middlewares/auth.js";

const router = Router();

router.use(protect);

router.post("/create-order", createOrder);

router.get("/order-history", getOrderHistory);

router.get("/order-details/:orderId", getOrderDetails);

export default router;
