import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User id is required"],
    },
    cartItems: [
      {
        productId: {
          type: String,
          required: [true, "Product id is required!"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity of products is required!"],
          min: 1,
        },
        subtotal: {
          type: Number,
          required: [true, "Subtotal is required !"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is required !"],
    },
    orderedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);