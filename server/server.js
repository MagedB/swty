import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import blogsRouter from "./routes/blogs.js";

dotenv.config();
const app = express();

app.use(cors());

// ✅ Only JSON APIs go through express.json
app.use(express.json());

// ✅ Serve uploaded files
app.use("/uploads", express.static("uploads"));
app.use("/uploads/blogs", express.static("uploads/blogs"));


// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
