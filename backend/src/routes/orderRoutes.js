import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderDetail,
  reviewOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderDetail);
router.patch("/:id/review", reviewOrder);

export default router;
