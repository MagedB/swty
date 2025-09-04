import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Table.css"; // ✅ reuse global styles

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("smart_devices");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // ✅ modal state
  const navigate = useNavigate();

  // ✅ Check user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !["admin", "moderator"].includes(user.role)) {
      alert("You do not have permission to add products");
      navigate("/");
    }
  }, [navigate]);

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      // latest first, keep only last 50
      setProducts(data.sort((a, b) => b.id - a.id).slice(0, 50));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert("✅ Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("smart_devices");
      setImage(null);
      setPreview(null);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product: " + err.message);
    }
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editProduct.name,
            description: editProduct.description,
            price: editProduct.price,
            category: editProduct.category,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update product");
      setEditProduct(null); // close modal
      fetchProducts(); // refresh
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="manage-container">
      <h1 className="table-title">Add Product</h1>

      {/* Form + Image side by side */}
      <div className="form-container">
        {/* Left - Form */}
        <form onSubmit={handleSubmit} className="form-box">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="smart_devices">Smart Devices</option>
              <option value="fashion">Fashion</option>
              <option value="automotive">Automotive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image:</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </div>
          <button type="submit" className="btn-edit">
            Add Product
          </button>
        </form>

        {/* Right - Image Preview */}
        <div className="image-preview">
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <p>No image selected</p>
          )}
        </div>
      </div>

      {/* Product List */}
      <h2 className="table-subtitle">Last 50 Products</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price ($)</th>
            <th>Category</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No products found
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>{p.category}</td>
              <td>
                <button className="btn-edit" onClick={() => setEditProduct(p)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Product</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <select
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
              >
                <option value="smart_devices">Smart Devices</option>
                <option value="fashion">Fashion</option>
                <option value="automotive">Automotive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-edit" onClick={handleEditSave}>
                Save
              </button>
              <button
                className="btn-delete"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
