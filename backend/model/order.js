import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Product id is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    image: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User id is required"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one order item is required",
      },
      required: [true, "Order items are required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    status: {
      type: String,
      enum: ["Pending Payment", "Placed", "Processing", "Delivered", "Cancelled", "Rejected"],
      default: "Placed",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "khalti"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Initiated", "Paid", "Failed"],
      default: "Pending",
    },
    purchaseOrderId: {
      type: String,
      default: "",
    },
    pidx: {
      type: String,
      default: "",
    },
    paymentUrl: {
      type: String,
      default: "",
    },
    stockAdjusted: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
