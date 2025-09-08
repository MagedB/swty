import express from "express";
import { pool } from "../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// ✅ Multer setup for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ================================
   ADD PRODUCT
================================ */
router.post(
  "/",
  requireAuth,
  requireRole(["admin", "moderator"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, category, sub_category } = req.body;

      if (!name || !price || !category || !sub_category) {
        return res
          .status(400)
          .json({ error: "Name, price, category, and sub_category are required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      const image = req.file.filename;

      const result = await pool.query(
        `INSERT INTO products (name, description, price, category, sub_category, image, visible, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,true, NOW())
         RETURNING id, name, description, price, category, sub_category, image, visible, created_at`,
        [name, description, price, category, sub_category, image]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ error: "Failed to add product" });
    }
  }
);

/* ================================
   GET PRODUCTS (with filters)
================================ */
router.get("/", async (req, res) => {
  try {
    const { category, all } = req.query;

    let query = `
      SELECT id, name, description, price, category, sub_category, image, visible, created_at
      FROM products
    `;
    const values = [];

    // Public: only visible products
    if (!all) {
      query += ` WHERE visible = true`;
    }

    // Add category filter
    if (category) {
      if (!all) {
        query += ` AND category = $1`;
        values.push(category);
      } else {
        query += ` WHERE category = $1`;
        values.push(category);
      }
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ================================
   UPDATE PRODUCT
================================ */
router.put(
  "/:id",
  requireAuth,
  requireRole(["admin", "moderator"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, category, sub_category } = req.body;

      let query, values;

      if (req.file) {
        query = `UPDATE products
                 SET name=$1, description=$2, price=$3, category=$4, sub_category=$5, image=$6
                 WHERE id=$7 RETURNING id, name, description, price, category, sub_category, image, visible, created_at`;
        values = [name, description, price, category, sub_category, req.file.filename, id];
      } else {
        query = `UPDATE products
                 SET name=$1, description=$2, price=$3, category=$4, sub_category=$5
                 WHERE id=$6 RETURNING id, name, description, price, category, sub_category, image, visible, created_at`;
        values = [name, description, price, category, sub_category, id];
      }

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

/* ================================
   TOGGLE VISIBILITY
================================ */
router.patch(
  "/:id/visibility",
  requireAuth,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      const { visible } = req.body;
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE products
         SET visible=$1
         WHERE id=$2
         RETURNING id, name, description, price, category, sub_category, image, visible, created_at`,
        [visible, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error toggling visibility:", err);
      res.status(500).json({ error: "Failed to update product visibility" });
    }
  }
);

/* ================================
   SEARCH PRODUCTS
================================ */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query required" });
    }

    const result = await pool.query(
      `SELECT id, name, description, price, category, sub_category, image, visible, created_at
       FROM products
       WHERE visible = true
         AND (LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))
       ORDER BY id DESC`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error searching products:", err);
    res.status(500).json({ error: "Failed to search products" });
  }
});

/* ================================
   DELETE PRODUCT
================================ */
router.delete(
  "/:id",
  requireAuth,
  requireRole(["admin", "moderator"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        "DELETE FROM products WHERE id=$1 RETURNING id",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
);

export default router;
