// server/routes/suppliers.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// ✅ GET all suppliers
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM suppliers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /api/suppliers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET one supplier
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM suppliers WHERE id = $1", [id]);
    if (!rows[0]) return res.status(404).json({ message: "Supplier not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/suppliers/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE supplier
router.post("/", async (req, res) => {
  try {
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      city,
      country,
      commercial_register,
      tax_id,
      bank_account,
      payment_terms,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Supplier name is required" });
    }

    const sql = `INSERT INTO suppliers 
      (name, contact_person, email, phone, address, city, country, commercial_register, tax_id, bank_account, payment_terms, notes, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now(), now())
      RETURNING *`;

    const params = [
      name.trim(),
      contact_person || null,
      email || null,
      phone || null,
      address || null,
      city || null,
      country || null,
      commercial_register || null,
      tax_id || null,
      bank_account || null,
      payment_terms || null,
      notes || null,
    ];

    const { rows } = await pool.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/suppliers error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE supplier
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: existingRows } = await pool.query("SELECT * FROM suppliers WHERE id=$1", [id]);
    if (!existingRows[0]) return res.status(404).json({ message: "Supplier not found" });

    const existing = existingRows[0];
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      city,
      country,
      commercial_register,
      tax_id,
      bank_account,
      payment_terms,
      notes,
    } = req.body;

    const sql = `UPDATE suppliers SET
      name=$1, contact_person=$2, email=$3, phone=$4, address=$5,
      city=$6, country=$7, commercial_register=$8, tax_id=$9,
      bank_account=$10, payment_terms=$11, notes=$12,
      updated_at=now()
      WHERE id=$13 RETURNING *`;

    const params = [
      name !== undefined ? name.trim() : existing.name,
      contact_person !== undefined ? contact_person : existing.contact_person,
      email !== undefined ? email : existing.email,
      phone !== undefined ? phone : existing.phone,
      address !== undefined ? address : existing.address,
      city !== undefined ? city : existing.city,
      country !== undefined ? country : existing.country,
      commercial_register !== undefined ? commercial_register : existing.commercial_register,
      tax_id !== undefined ? tax_id : existing.tax_id,
      bank_account !== undefined ? bank_account : existing.bank_account,
      payment_terms !== undefined ? payment_terms : existing.payment_terms,
      notes !== undefined ? notes : existing.notes,
      id,
    ];

    const { rows } = await pool.query(sql, params);
    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/suppliers/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE supplier
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM suppliers WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ message: "Supplier not found" });

    await pool.query("DELETE FROM suppliers WHERE id=$1", [id]);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    console.error("DELETE /api/suppliers/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
