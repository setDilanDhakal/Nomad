import { Router } from "express";
import {
  createOrder,
  deleteMyOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.js";

const orderRoute = Router();

orderRoute.route("/").post(verifyUser, createOrder);
orderRoute.route("/").get(verifyAdmin, getAllOrders);
orderRoute.route("/my-orders").get(verifyUser, getMyOrders);
orderRoute.route("/:id").delete(verifyUser, deleteMyOrder);
orderRoute.route("/:id/status").patch(verifyAdmin, updateOrderStatus);
orderRoute.route("/:id").get(verifyUser, getOrderById);

export default orderRoute;
