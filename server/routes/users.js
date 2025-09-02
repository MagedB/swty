import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, phone, role FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update user role (Admin only)
router.put("/:id/role", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, username, email, phone, role",
      [role, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete a user (Admin only)
router.delete("/:id", requireAuth, requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
