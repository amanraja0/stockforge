import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  createUserByAdmin,
  getAllUsers,
  getUserActivityLogs,
  deleteUserByAdmin,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createUserByAdmin
);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllUsers
);

router.get(
  "/user-activity-logs",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUserActivityLogs
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteUserByAdmin
);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);

export default router;