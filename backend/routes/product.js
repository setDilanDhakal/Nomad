import { Router } from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getActiveProducts,
  getProductById,
  updateProductById,
} from "../controllers/product.js";
import { productUpload } from "../middlewares/multer.js";

const productRoute = Router();

productRoute.route("/").post(productUpload.array("image", 3), createProduct);
productRoute.route("/").get(getAllProducts);
productRoute.route("/active").get(getActiveProducts);
productRoute.route("/:id").get(getProductById);
productRoute.route("/:id").put(productUpload.array("image", 3), updateProductById);
productRoute.route("/:id").delete(deleteProductById);

export default productRoute;
