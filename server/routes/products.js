import express from "express";
import { pool } from "../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// ✅ Set up storage with unique filenames
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Add product
router.post(
  "/",
  requireAuth,
  requireRole(["admin", "moderator"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      const image = req.file.filename;

      const result = await pool.query(
        "INSERT INTO products (name, description, price, category, image) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [name, description, price, category, image]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ error: "Failed to add product" });
    }
  }
);

// ✅ Get products by category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let result;
    if (category) {
      result = await pool.query(
        "SELECT * FROM products WHERE category=$1 AND visible=true",
        [category]
      );
    } else {
      result = await pool.query("SELECT * FROM products WHERE visible=true");
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Update product visibility
router.patch(
  "/:id/visibility",
  requireAuth,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      const { visible } = req.body;
      const { id } = req.params;

      const result = await pool.query(
        "UPDATE products SET visible=$1 WHERE id=$2 RETURNING *",
        [visible, id]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error updating visibility:", err);
      res.status(500).json({ error: "Failed to update product visibility" });
    }
  }
);

export default router;
