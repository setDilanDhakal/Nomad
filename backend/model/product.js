import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  image: {
    type: [String],
    required: [true, "Images are required"],
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length >= 1 && value.length <= 3;
      },
      message: "Add between 1 and 3 images",
    },
  },

  genderType: {
    type: String,
    enum: ["male", "female", "unisex"],
    required: [true, "Gender type is required"],
  },

  stock: {
    type: Number,
    default: 0,
    required: [true, "Stock is required"],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
