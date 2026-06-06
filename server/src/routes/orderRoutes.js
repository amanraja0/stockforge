import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/", authMiddleware, getOrders);

router.patch(
  "/:id/status",
  authMiddleware,
  updateOrderStatus
);

export default router;