import { Router } from "express";
import { getCart, addItem, removeItem, updateQuantity } from "../../../controllers/cart.js";

const router = Router();

router.get("/get-cart", getCart);

router.post("/add-item", addItem);

router.delete("/remove-item/:productId", removeItem);

router.patch("/update-quantity/:productId", updateQuantity);

export default router;
