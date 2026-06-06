import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  updateInventory,
  getInventoryLogs,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  updateInventory
);

router.get(
  "/logs",
  authMiddleware,
  getInventoryLogs
);

export default router;