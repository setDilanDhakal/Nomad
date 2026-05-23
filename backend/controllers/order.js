import Cart from "../model/cart.js";
import Order from "../model/order.js";
import Product from "../model/product.js";
import User from "../model/user.js";

const normalizeItemsInput = (body) => {
  if (Array.isArray(body.items) && body.items.length) {
    return body.items;
  }

  if (body.productId) {
    return [
      {
        productId: body.productId,
        quantity: body.quantity || 1,
      },
    ];
  }

  return [];
};

const buildOrderItems = async (body) => {
  const rawItems = normalizeItemsInput(body);

  if (!rawItems.length) {
    throw new Error("At least one product is required");
  }

  const productIds = rawItems.map((item) => String(item.productId || ""));
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const items = rawItems.map((item) => {
    const product = productMap.get(String(item.productId || ""));

    if (!product) {
      throw new Error("One or more products were not found");
    }

    const quantity = Number(item.quantity || 0);

    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    if (!product.isActive) {
      throw new Error(`${product.name} is not active`);
    }

    if (quantity > Number(product.stock || 0)) {
      throw new Error(`Only ${product.stock || 0} item(s) available for ${product.name}`);
    }

    return {
      productId: String(product._id),
      name: product.name,
      price: Number(product.price || 0),
      image: Array.isArray(product.image) ? product.image[0] || "" : product.image || "",
      quantity,
      subtotal: Number(product.price || 0) * quantity,
    };
  });

  const totalPrice = items.reduce((total, item) => total + Number(item.subtotal || 0), 0);

  return { items, totalPrice };
};

const reduceStockForItems = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found for ${item.name}`);
    }

    if (Number(product.stock || 0) < Number(item.quantity || 0)) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    product.stock = Number(product.stock || 0) - Number(item.quantity || 0);
    await product.save();
  }
};

const restoreStockForItems = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      continue;
    }

    product.stock = Number(product.stock || 0) + Number(item.quantity || 0);
    await product.save();
  }
};

const clearUserCart = async (userId) => {
  await Cart.findOneAndDelete({ userId });
};

const attachOrderUserDetails = async (orders) => {
  const orderList = Array.isArray(orders) ? orders : orders ? [orders] : [];
  const userIds = [...new Set(orderList.map((order) => String(order.userId || "")).filter(Boolean))];

  if (!userIds.length) {
    return orderList;
  }

  const users = await User.find({ _id: { $in: userIds } }).select("fullName email mobileNo image");
  const userMap = new Map(users.map((user) => [String(user._id), user]));

  return orderList.map((order) => {
    const normalizedOrder =
      typeof order?.toObject === "function" ? order.toObject() : { ...order };
    const matchedUser = userMap.get(String(order.userId || ""));

    return {
      ...normalizedOrder,
      user: matchedUser
        ? {
            _id: matchedUser._id,
            fullName: matchedUser.fullName || "Unknown User",
            email: matchedUser.email || "",
            mobileNo: matchedUser.mobileNo || "",
            image: matchedUser.image || "",
          }
        : null,
    };
  });
};

// [SECTION] Create Order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalPrice } = await buildOrderItems(req.body);

    const order = await Order.create({
      userId,
      items,
      totalPrice,
      paymentMethod: "cod",
      paymentStatus: "Pending",
      status: "Placed",
      stockAdjusted: true,
    });

    await reduceStockForItems(items);
    await clearUserCart(userId);

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error from createOrder:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

// [SECTION] Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1, orderedOn: -1 });
    const normalizedOrders = await attachOrderUserDetails(orders);

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: normalizedOrders,
    });
  } catch (error) {
    console.error("Error from getMyOrders:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1, orderedOn: -1 });
    const normalizedOrders = await attachOrderUserDetails(orders);

    return res.status(200).json({
      message: "All orders fetched successfully",
      data: normalizedOrders,
    });
  } catch (error) {
    console.error("Error from getAllOrders:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get Order By Id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (String(order.userId) !== String(req.user.id) && !req.user.isAdmin) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const [normalizedOrder] = await attachOrderUserDetails([order]);

    return res.status(200).json({
      message: "Order fetched successfully",
      data: normalizedOrder,
    });
  } catch (error) {
    console.error("Error from getOrderById:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Cancelled", "Rejected"].includes(String(status || ""))) {
      return res.status(400).json({
        message: "Only Cancelled or Rejected status is allowed",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (["Delivered", "Cancelled", "Rejected"].includes(order.status)) {
      return res.status(400).json({
        message: `Order is already ${order.status.toLowerCase()}`,
      });
    }

    if (order.stockAdjusted) {
      await restoreStockForItems(order.items || []);
      order.stockAdjusted = false;
    }

    order.status = status;
    await order.save();

    const [normalizedOrder] = await attachOrderUserDetails([order]);

    return res.status(200).json({
      message: `Order ${status.toLowerCase()} successfully`,
      data: normalizedOrder,
    });
  } catch (error) {
    console.error("Error from updateOrderStatus:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Delete My Order
const deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (String(order.userId) !== String(req.user.id)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (!["Cancelled", "Rejected"].includes(String(order.status || ""))) {
      return res.status(400).json({
        message: "Only cancelled or rejected orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(order._id);

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error from deleteMyOrder:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {
  createOrder,
  deleteMyOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
