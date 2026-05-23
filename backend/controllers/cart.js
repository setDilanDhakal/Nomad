import Cart from "../model/cart.js";
import Product from "../model/product.js";



// [SECTION] Get all carts for admin
const getAllCarts = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const carts = await Cart.find().sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      message: "All carts fetched successfully",
      data: carts,
    });
  } catch (error) {
    console.error("Error from getAllCarts:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [Section] Add cart item
const addCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product id and quantity are required",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const qty = Number(quantity);
    const subtotal = product.price * qty;

    if (qty > product.stock) {
      return res.status(400).json({
        message: "Cannot add more than available stock",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        cartItems: [
          {
            productId,
            quantity: qty,
            subtotal,
          },
        ],
        totalPrice: subtotal,
      });

      return res.status(201).json({
        message: "Item added to cart",
        data: cart,
      });
    }

    const existingItem = cart.cartItems.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      if (existingItem.quantity + qty > product.stock) {
        return res.status(400).json({
          message: "Cannot add more than available stock",
        });
      }

      existingItem.quantity += qty;
      existingItem.subtotal = product.price * existingItem.quantity;
    } else {
      cart.cartItems.push({
        productId,
        quantity: qty,
        subtotal,
      });
    }

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    await cart.save();

    return res.status(200).json({
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error from addCartItem:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] getcart by user id 
const getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error from getCartByUserId:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update cart item
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "Product id and quantity are required",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cartItem = cart.cartItems.find((item) => item.productId === productId);

    if (!cartItem) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: "Cannot update more than available stock",
      });
    }

    cartItem.quantity = Number(quantity);
    cartItem.subtotal = product.price * cartItem.quantity;

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    await cart.save();

    return res.status(200).json({
      message: "Cart item updated",
      data: cart,
    });
  } catch (error) {
    console.error("Error from updateCartItem:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// [SECTION] Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const cartId = req.params.id;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    if (cart.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await cart.deleteOne();

    return res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("Error from deleteCartItem:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export { addCartItem, getAllCarts, getCartByUserId, updateCartItem, deleteCartItem };
