import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import dotenv from "dotenv";

const app = express();

dotenv.config({ path: "./.env" });

const allowedOrigins = [
  "http://localhost:5173",
  "https://nomad-mu.vercel.app",
  "https://nomad-zom9cl26p-dilans-projects-c326c94c.vercel.app",
  process.env.CLIENT_URL,
  ...(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isExplicitlyAllowed = allowedOrigins.includes(origin);
      const isVercelPreview = /^https:\/\/nomad(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

      if (isExplicitlyAllowed || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

export default app;



