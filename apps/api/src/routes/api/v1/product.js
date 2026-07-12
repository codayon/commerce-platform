import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../../../controllers/product.js";

const router = Router();

router.post("/create-product", createProduct);
router.get("/get-product/:productId", getProduct);
router.delete("/delete-product/:productId", deleteProduct);
router.patch("/update-product/:productId", updateProduct);

export default router;
