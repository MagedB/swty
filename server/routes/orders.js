import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ==========================
// Get all orders (with user info & items)
// ==========================
router.get("/", requireAuth, async (req, res) => {
  try {
    let ordersResult;

    if (req.user.role === "admin") {
      // Admin: get all orders with user info
      ordersResult = await pool.query(
        `SELECT o.*, u.username, u.phone
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
    } else {
      // Non-admin: get only own orders
      ordersResult = await pool.query(
        `SELECT o.*, u.username, u.phone
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [req.user.id]
      );
    }

    const orders = ordersResult.rows;

    // Get order items for all orders
    const orderIds = orders.map((o) => o.id);
    let itemsMap = {};
    if (orderIds.length > 0) {
      const itemsResult = await pool.query(
        `SELECT oi.*, p.name, p.image
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ANY($1::int[])`,
        [orderIds]
      );
      itemsResult.rows.forEach((item) => {
        if (!itemsMap[item.order_id]) itemsMap[item.order_id] = [];
        itemsMap[item.order_id].push(item);
      });
    }

    // Attach items and user to each order
    const ordersWithDetails = orders.map((o) => ({
      ...o,
      user: { username: o.username || "N/A", phone: o.phone || "N/A" },
      items: itemsMap[o.id] || [],
    }));

    res.json(ordersWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// ==========================
// Create new order
// ==========================
router.post("/", requireAuth, async (req, res) => {
  const { items, delivery_place, delivery_fee } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ msg: "No items in order" });
  }
  if (!delivery_place) {
    return res.status(400).json({ msg: "Delivery place is required" });
  }

  try {
    // Calculate total price
    const itemsTotal = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * (item.quantity || 1),
      0
    );
    const totalPrice = itemsTotal + Number(delivery_fee || 0);

    // Insert order
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, delivery_place, delivery_fee, total_price, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [req.user.id, delivery_place, delivery_fee, totalPrice]
    );

    const order = orderResult.rows[0];

    // Insert order items using unit_price
    const orderItemsPromises = items.map((item) =>
      pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity || 1, Number(item.unit_price)]
      )
    );

    await Promise.all(orderItemsPromises);

    res.status(201).json({ msg: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// ==========================
// DELETE order by ID
// ==========================
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });

  try {
    await pool.query("DELETE FROM orders WHERE id = $1", [id]);
    res.json({ msg: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// ==========================
// UPDATE order (delivery_place only)
// ==========================
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { delivery_place } = req.body;
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });

  try {
    await pool.query(
      "UPDATE orders SET delivery_place = $1 WHERE id = $2",
      [delivery_place, id]
    );
    res.json({ msg: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
