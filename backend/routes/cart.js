import {Router} from 'express';
import {
  addCartItem,
  deleteCartItem,
  getAllCarts,
  getCartByUserId,
  updateCartItem,
} from "../controllers/cart.js";
import { verifyUser } from "../middlewares/auth.js";
const cartRoute = Router();

cartRoute.route("/").get(verifyUser, getAllCarts);
cartRoute.route("/").post(verifyUser, addCartItem);
cartRoute.route("/").put(verifyUser, updateCartItem);
cartRoute.route("/:id").delete(verifyUser, deleteCartItem);
cartRoute.route("/:id").get( verifyUser, getCartByUserId);



export default cartRoute
