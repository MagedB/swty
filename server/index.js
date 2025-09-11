import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import blogsRouter from "./routes/blogs.js";
import brandsRouter from "./routes/brands.js"; // ✅ NEW
import supplierRoutes from "./routes/suppliers.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files (covers /uploads, /uploads/blogs, /uploads/brands, etc.)
app.use("/uploads", express.static("uploads"));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogsRouter);
app.use("/api/brands", brandsRouter); // ✅ NEW
app.use("/api/suppliers", supplierRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
