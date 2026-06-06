import express from "express";

import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  restockProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProduct
);

router.get("/", authMiddleware, getProducts);

router.get("/:id", authMiddleware, getSingleProduct);

router.put("/:id", authMiddleware, updateProduct);

router.post("/restock", restockProduct);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProduct
);

export default router;