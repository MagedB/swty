import React, { useEffect, useState } from "react";

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
        body: JSON.stringify({ deliveryPlace: newDeliveryPlace }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto" }}>
      <h1>Manage Orders</h1>
      {msg && <p>{msg}</p>}
      <table border="1" cellPadding="5" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Phone</th>
            <th>Order Items</th>
            <th>Delivery Place</th>
            <th>Delivery Fee</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const user = order.user || {};
            const items = order.items || [];
            const itemsTotal = items.reduce(
              (sum, item) => sum + Number(item.price) * (item.quantity || 1),
              0
            );
            const total = itemsTotal + Number(order.delivery_fee || 0);

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.phone || "N/A"}</td>
                <td>
                  <ul>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <li key={item.id}>
                          {item.name} x {item.quantity || 1} (${item.price})
                        </li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>
                </td>
                <td>{order.delivery_place || "N/A"}</td>
                <td>${order.delivery_fee || 0}</td>
                <td>${total.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(order.id)}>Edit</button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    style={{ marginLeft: "5px" }}
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
