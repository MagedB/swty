import express from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret123", // fallback if not set
    { expiresIn: "7d" }
  );
};

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existing = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (username, email, phone, password, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, email, role, created_at`,
      [username, email, phone || null, hashed, role || "user"]
    );

    const newUser = result.rows[0];

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user
    const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }
    const user = userRes.rows[0];

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // Clean user object (omit password)
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    // Generate token
    const token = generateToken(safeUser);

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
