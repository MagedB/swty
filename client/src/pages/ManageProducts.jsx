import React, { useEffect, useState } from "react";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products?all=true", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleToggleVisible = async (id, currentStatus) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ visible: !currentStatus }),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    try {
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append("price", editProduct.price);
      formData.append("category", editProduct.category);
      if (editProduct.imageFile) {
        formData.append("image", editProduct.imageFile);
      }

      await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto" }}>
      <h1>Manage Products</h1>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price ($)</th>
            <th>Category</th>
            <th>Image</th>
            <th>Created At</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                {p.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    alt={p.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
              <td>{p.visible ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => setEditProduct(p)}>Edit</button>
                <button
                  onClick={() => handleToggleVisible(p.id, p.visible)}
                  style={{ marginLeft: "5px" }}
                >
                  {p.visible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ marginLeft: "5px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editProduct && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "30%",
            background: "white",
            padding: "20px",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          <h2>Edit Product</h2>
          <input
            type="text"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
            placeholder="Name"
          />
          <br />
          <textarea
            value={editProduct.description}
            onChange={(e) =>
              setEditProduct({ ...editProduct, description: e.target.value })
            }
            placeholder="Description"
          />
          <br />
          <input
            type="number"
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
            placeholder="Price"
          />
          <br />
          <input
            type="text"
            value={editProduct.category}
            onChange={(e) =>
              setEditProduct({ ...editProduct, category: e.target.value })
            }
            placeholder="Category"
          />
          <br />
          <input
            type="file"
            onChange={(e) =>
              setEditProduct({ ...editProduct, imageFile: e.target.files[0] })
            }
          />
          <br />
          <button onClick={handleEditSave}>Save</button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
