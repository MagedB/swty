// server/routes/products.js
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
      const { name, description, price, category, sub_category, brand_id, supplier_id } = req.body;

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
        `INSERT INTO products 
         (name, description, price, category, sub_category, image, visible, created_at, brand_id, supplier_id)
         VALUES ($1,$2,$3,$4,$5,$6,true, NOW(), $7, $8)
         RETURNING id, name, description, price, category, sub_category, image, visible, created_at, brand_id, supplier_id`,
        [name, description, price, category, sub_category, image, brand_id || null, supplier_id || null]
      );

      // fetch with joins
      const product = await pool.query(
        `SELECT p.*, b.name AS brand_name, s.name AS supplier_name
         FROM products p
         LEFT JOIN brands b ON p.brand_id = b.id
         LEFT JOIN suppliers s ON p.supplier_id = s.id
         WHERE p.id = $1`,
        [result.rows[0].id]
      );

      res.json(product.rows[0]);
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
    const { category, sub_category, all } = req.query;

    let query = `
      SELECT p.*, 
             b.name AS brand_name, 
             s.name AS supplier_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
    `;
    const values = [];
    let conditions = [];

    // Public: only visible products
    if (!all) {
      conditions.push(`p.visible = true`);
    }

    if (category) {
      values.push(category);
      conditions.push(`p.category = $${values.length}`);
    }

    if (sub_category) {
      values.push(sub_category);
      conditions.push(`p.sub_category = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.id DESC";

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
      const { name, description, price, category, sub_category, brand_id, supplier_id } = req.body;

      let query, values;

      if (req.file) {
        query = `UPDATE products
                 SET name=$1, description=$2, price=$3, category=$4, sub_category=$5, image=$6, brand_id=$7, supplier_id=$8
                 WHERE id=$9 
                 RETURNING id`;
        values = [name, description, price, category, sub_category, req.file.filename, brand_id || null, supplier_id || null, id];
      } else {
        query = `UPDATE products
                 SET name=$1, description=$2, price=$3, category=$4, sub_category=$5, brand_id=$6, supplier_id=$7
                 WHERE id=$8 
                 RETURNING id`;
        values = [name, description, price, category, sub_category, brand_id || null, supplier_id || null, id];
      }

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      // fetch with joins
      const product = await pool.query(
        `SELECT p.*, b.name AS brand_name, s.name AS supplier_name
         FROM products p
         LEFT JOIN brands b ON p.brand_id = b.id
         LEFT JOIN suppliers s ON p.supplier_id = s.id
         WHERE p.id = $1`,
        [id]
      );

      res.json(product.rows[0]);
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

      await pool.query(
        `UPDATE products
         SET visible=$1
         WHERE id=$2`,
        [visible, id]
      );

      const product = await pool.query(
        `SELECT p.*, b.name AS brand_name, s.name AS supplier_name
         FROM products p
         LEFT JOIN brands b ON p.brand_id = b.id
         LEFT JOIN suppliers s ON p.supplier_id = s.id
         WHERE p.id = $1`,
        [id]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product.rows[0]);
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
      `SELECT p.*, b.name AS brand_name, s.name AS supplier_name
       FROM products p
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.visible = true
         AND (LOWER(p.name) LIKE LOWER($1) OR LOWER(p.description) LIKE LOWER($1))
       ORDER BY p.id DESC`,
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
