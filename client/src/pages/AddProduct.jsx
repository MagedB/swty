import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("smart_devices");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // ✅ Check user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !["admin", "moderator"].includes(user.role)) {
      alert("You do not have permission to add products");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !image) {
      alert("Please fill all fields and select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ only token, no Content-Type (browser sets it)
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert("✅ Product added successfully!");
      navigate("/dashboard/add-product");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          >
            <option value="smart_devices">Smart Devices</option>
            <option value="fashion">Fashion</option>
            <option value="automotive">Automotive</option>
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
            style={{ margin: "5px 0" }}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Add Product
        </button>
      </form>
    </div>
  );
}
