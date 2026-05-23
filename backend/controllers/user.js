import User from "../model/user.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import { createAccessToken } from "../middlewares/auth.js";


// [SECTION] Register
const Register = async (req, res) => {
  let createdUserId = "";

  try {
    const cleanLocal = async () => {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch {}
      }
    };

    const fullName = (req.body.fullName || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";
    const mobileNo = (req.body.mobileNo || "").trim();

    if (!fullName) {
      await cleanLocal();
      return res.status(400).send({ message: "Full name is required" });
    }

    if (!email || !email.includes("@")) {
      await cleanLocal();
      return res.status(400).send({ message: "Email invalid" });
    }

    if (mobileNo && mobileNo.length !== 10) {
      await cleanLocal();
      return res.status(400).send({ message: "Mobile number invalid" });
    }

    if (!password || password.length < 8) {
      await cleanLocal();
      return res.status(400).send({
        message: "Password must be at least 8 characters",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      await cleanLocal();
      return res.status(400).send({
        message: "Email already registered , Login Instead",
      });
    }

    if (mobileNo) {
      const existingMobile = await User.findOne({ mobileNo });
      if (existingMobile) {
        await cleanLocal();
        return res.status(400).send({
          message: "Mobile number already registered",
        });
      }
    }

    let imageUrl = "";
    if (req.file?.filename) {
      imageUrl = `/uploads/users/${req.file.filename}`;
    }

    const newUser = new User({
      fullName,
      email,
      password: bcrypt.hashSync(password, 10),
      mobileNo,
      image: imageUrl,
    });

    await newUser.save();
    createdUserId = newUser._id?.toString?.() || "";

    const token = createAccessToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).send({
      message: "Registered successfully",
      data: userObj,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);

    try {
      if (createdUserId) {
        await User.findByIdAndDelete(createdUserId).catch(() => {});
      }
    } catch (_) {}

    return res.status(500).send({
      message: "Registration failed",
      error: error.message,
    });
  }
};


// [SECTION] Login
const Login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const token = createAccessToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).send({
      message: "Login successful",
      data: userObj,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({
      message: "Login failed",
      error: error.message,
    });
  }
};


// [SECTION] update user
const UpdateUser = async (req, res) => {
  try {
    const allowedFields = ["fullName", "email", "mobileNo", "password"];
    const restrictedFields = ["isAdmin"];
    const incomingFields = Object.keys(req.body || {});

    const hasRestrictedField = incomingFields.some((field) =>
      restrictedFields.includes(field)
    );

    if (hasRestrictedField) {
      return res.status(400).send({
        message: "You cannot update role",
      });
    }

    const invalidFields = incomingFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).send({
        message: "Invalid fields provided",
        invalidFields,
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (req.body.email && !req.body.email.includes("@")) {
      return res.status(400).send({ message: "Email invalid" });
    }

    if (req.body.mobileNo && req.body.mobileNo.length !== 10) {
      return res.status(400).send({ message: "Mobile number invalid" });
    }

    if (req.body.password && req.body.password.length < 8) {
      return res.status(400).send({
        message: "Password must be at least 8 characters",
      });
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).send({ message: "Email already registered" });
      }
    }

    if (req.body.mobileNo && req.body.mobileNo !== user.mobileNo) {
      const existingMobile = await User.findOne({ mobileNo: req.body.mobileNo });
      if (existingMobile) {
        return res.status(400).send({ message: "Mobile number already registered" });
      }
    }

    if (req.body.fullName) {
      user.fullName = req.body.fullName;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.mobileNo) {
      user.mobileNo = req.body.mobileNo;
    }

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }

    if (req.file?.filename) {
      user.image = `/uploads/users/${req.file.filename}`;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).send({
      message: "User updated",
      data: userObj,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).send({
      message: "User update failed",
      error: error.message,
    });
  }
};

// [SECTION] get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).send({
      message: "User found",
      data: userObj,
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).send({
      message: "Failed to get user by id",
      error: error.message,
    });
  }
};


export { Register, Login, UpdateUser, getUserById };
