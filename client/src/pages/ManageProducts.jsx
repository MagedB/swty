import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function ManageProducts() {
  const [products, setProducts] = useState({
    smart_devices: [],
    fashion: [],
    automotive: [],
  });

  // Check user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !["admin", "moderator"].includes(user.role)) {
      alert("You do not have permission to manage products");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const categories = ["smart_devices", "fashion", "automotive"];
      const result = {};
      for (let cat of categories) {
        const res = await API.get(`/products?category=${cat}`);
        result[cat] = res.data;
      }
      setProducts(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await API.put(`/products/${id}/toggle`, { visible: !currentStatus });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle visibility");
    }
  };

  const renderTable = (category, items) => (
    <div style={{ marginBottom: "30px" }}>
      <h2>{category.replace("_", " ").toUpperCase()}</h2>
      <table border="1" cellPadding="5" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.visible ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleToggle(p.id, p.visible)}>
                  {p.visible ? "Hide" : "Show"}
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: "5px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h1>Manage Products</h1>
      {renderTable("Smart Devices", products.smart_devices)}
      {renderTable("Fashion", products.fashion)}
      {renderTable("Automotive", products.automotive)}
    </div>
  );
}
