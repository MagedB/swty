import React, { useEffect, useState } from "react";
import "../styles/Table.css"; // ✅ reuse the same styles

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  // Check user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("You do not have permission to manage orders");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setMsg("Failed to fetch orders");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete order");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  const handleEdit = async (id) => {
    const newDeliveryPlace = prompt("Enter new delivery place:");
    if (!newDeliveryPlace) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delivery_place: newDeliveryPlace }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto" }}>
      <h1 className="table-title">Manage Orders</h1>
      {msg && <p style={{ textAlign: "center", color: "red" }}>{msg}</p>}

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Phone</th>
            <th>Order Items</th>
            <th>Delivery Place</th>
            <th>Items Total</th>
            <th>Delivery Fee</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
          {orders.map((order) => {
            const user = order.user || {};
            const items = order.items || [];
            const itemsTotal = items.reduce(
              (sum, item) => sum + Number(item.unit_price) * (item.quantity || 1),
              0
            );
            const total = itemsTotal + Number(order.delivery_fee || 0);

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.phone || "N/A"}</td>
                <td>
                  <ul className="order-items-list">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <li key={item.id} className="order-item">
                          <img
                            src={
                              item.image?.startsWith("http")
                                ? item.image
                                : `http://localhost:5000/uploads/${item.image}`
                            }
                            alt={item.name}
                            className="order-item-image"
                          />
                          <span>
                            {item.name} x {item.quantity || 1} – $
                            {Number(item.unit_price).toFixed(2)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>
                </td>
                <td>{order.delivery_place || "N/A"}</td>
                <td>${itemsTotal.toFixed(2)}</td>
                <td>${Number(order.delivery_fee || 0).toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(order.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
