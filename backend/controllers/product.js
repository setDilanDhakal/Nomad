import Product from "../model/product.js";


// [SECTION] Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, genderType, stock , isActive } = req.body;

    if (!name || !description || price === undefined || !genderType || stock === undefined) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({
        message: "At least 1 image is required",
      });
    }

    const image = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      genderType,
      stock,
      isActive,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error from createProduct:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};



// [SECTION] Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      message: "All products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error from getAllProducts:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error from getProductById:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get Active Products
const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdOn: -1 });

    return res.status(200).json({
      message: "Active products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error from getActiveProducts:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Product by ID
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { name, description, price, genderType, stock, isActive } = req.body;

    if (req.files && req.files.length > 3) {
      return res.status(400).json({
        message: "You can upload up to 3 images",
      });
    }

    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (genderType !== undefined) {
      product.genderType = genderType;
    }

    if (stock !== undefined) {
      product.stock = stock;
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    if (req.files && req.files.length > 0) {
      product.image = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    console.error("Error from updateProductById:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// [SECTION] Delete Product by ID
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error from deleteProductById:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  getActiveProducts,
  updateProductById,
  deleteProductById,
};
