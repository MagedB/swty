import express from "express";
import { pool } from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Multer config: upload to "uploads/blogs"
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/blogs"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});
const upload = multer({ storage });

// ✅ Get all blogs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get blogs by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      "SELECT * FROM blogs WHERE category = $1 ORDER BY created_at DESC",
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching category blogs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get single blog by category + slug
router.get("/:category/:slug", async (req, res) => {
  try {
    const { category, slug } = req.params;
    const result = await pool.query(
      "SELECT * FROM blogs WHERE category = $1 AND slug = $2 LIMIT 1",
      [category, slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get single blog by slug (legacy)
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query("SELECT * FROM blogs WHERE slug = $1", [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Get single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);

    if (blog.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog.rows[0]);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new blog (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, slug, content, category, author } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO blogs (title, slug, content, category, author, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, slug, content, category, author, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update blog
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, category, author } = req.body;
    const image = req.file ? req.file.filename : req.body.image || null;

    const result = await pool.query(
      `UPDATE blogs
       SET title=$1, slug=$2, content=$3, category=$4, author=$5, image=$6
       WHERE id=$7
       RETURNING *`,
      [title, slug, content, category, author, image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete blog
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM blogs WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
