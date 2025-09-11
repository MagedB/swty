// server/routes/brands.js
import express from "express";
import { pool } from "../db.js";
import upload from "../middleware/upload.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// ✅ Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandsDir = path.join(__dirname, "..", "uploads", "brands");

// GET /api/brands -> list
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM brands ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/brands error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/brands/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM brands WHERE id = $1", [id]);
    if (!rows[0]) return res.status(404).json({ message: "Brand not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/brands/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/brands -> create (multipart/form-data, logo optional)
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { name, description, website } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const logoFilename = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO brands (name, logo_url, description, website)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const params = [name.trim(), logoFilename, description || null, website || null];

    const { rows } = await pool.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/brands error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/brands/:id -> update (logo optional)
router.put("/:id", upload.single("logo"), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: existingRows } = await pool.query("SELECT * FROM brands WHERE id = $1", [id]);
    if (!existingRows[0]) return res.status(404).json({ message: "Brand not found" });
    const existing = existingRows[0];

    const { name, description, website } = req.body;
    const logoFilename = req.file ? req.file.filename : existing.logo_url;

    if (req.file && existing.logo_url) {
      const oldPath = path.join(brandsDir, existing.logo_url);
      fs.unlink(oldPath, (err) => {
        if (err) console.warn("Failed to remove old logo:", err.message);
      });
    }

    const sql = `
      UPDATE brands
      SET name=$1, logo_url=$2, description=$3, website=$4
      WHERE id=$5 RETURNING *
    `;
    const params = [
      name !== undefined ? name.trim() : existing.name,
      logoFilename,
      description !== undefined ? description : existing.description,
      website !== undefined ? website : existing.website,
      id,
    ];

    const { rows } = await pool.query(sql, params);
    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/brands/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/brands/:id -> delete (prevent if products reference)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: countRows } = await pool.query(
      "SELECT COUNT(*)::int AS cnt FROM products WHERE brand_id = $1",
      [id]
    );
    const cnt = countRows[0].cnt;
    if (cnt > 0) {
      return res
        .status(400)
        .json({ message: `Cannot delete: ${cnt} product(s) reference this brand.` });
    }

    const { rows } = await pool.query("SELECT * FROM brands WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ message: "Brand not found" });
    const brand = rows[0];

    await pool.query("DELETE FROM brands WHERE id=$1", [id]);

    if (brand.logo_url) {
      const filePath = path.join(brandsDir, brand.logo_url);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete logo on disk:", err.message);
      });
    }

    res.json({ message: "Brand deleted" });
  } catch (err) {
    console.error("DELETE /api/brands/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
