import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


// [SECTION] Token Creation
export const createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};



// [SECTION] Admin Verification
export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "No token" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!user.isAdmin) {
      return res.status(403).send({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

// [SECTION] User Verification
export const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "No token" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};
