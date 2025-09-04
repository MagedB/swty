import React, { useEffect, useState } from "react";
import "../styles/Table.css"; // ✅ reuse same styles

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto" }}>
      <h1 className="table-title">My Orders</h1>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order Items</th>
            <th>Delivery Place</th>
            <th>Items Total</th>
            <th>Delivery Fee</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                You have no orders yet
              </td>
            </tr>
          )}
          {orders.map((order) => {
            const itemsTotal = order.items.reduce(
              (sum, item) => sum + Number(item.unit_price) * (item.quantity || 1),
              0
            );
            const total = itemsTotal + Number(order.delivery_fee || 0);

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.items.length === 0 ? (
                    <p>No items</p>
                  ) : (
                    <ul className="order-items-list">
                      {order.items.map((item) => (
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
                      ))}
                    </ul>
                  )}
                </td>
                <td>{order.delivery_place || "N/A"}</td>
                <td>${itemsTotal.toFixed(2)}</td>
                <td>${Number(order.delivery_fee || 0).toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
                <td>{order.status || "pending"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
