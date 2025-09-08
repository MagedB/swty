import React, { useEffect, useState } from "react";
import "../styles/Table.css"; // contains table + modal styles

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // ✅ category → subcategory map (same as AddProduct.jsx)
  const subCategories = {
    smart_devices: [
      "Pc and Laptops",
      "Computer Accessories",
      "Smart Homes Devices",
      "Cameras",
      "Video Games",
    ],
    mobiles_tablets: [
      "Mobile Phones",
      "Tablets",
      "Chargers and PowerBanks",
      "Cases and Covers",
      "Accessories",
    ],
    woman_fashion: [
      "Clothes",
      "Shoes and Bags",
      "Beauty and Makeup",
      "Gold and jewelry",
      "Accessories and Perfumes",
    ],
    man_fashion: [
      "Clothes",
      "Shoes and Bags",
      "HomeWear",
      "Fitnes and GymAccessories",
      "Accessories and Perfumes",
    ],
    kids: ["Boys Fashion", "Girls Fashion", "Toys", "Kids School", "Babys"],
    automotive: [
      "Auto Tools",
      "Cars Parts",
      "Motorcycle Parts",
      "Oils and CarCare",
      "Wheels and Battery",
    ],
  };

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
      formData.append("sub_category", editProduct.sub_category || "");
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
    <div className="manage-container">
      <h1>Manage Products</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price ($)</th>
            <th>Category</th>
            <th>Sub Category</th>
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
              <td>{p.sub_category || "—"}</td>
              <td>
                {p.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    alt={p.name}
                    className="table-image"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
              <td>{p.visible ? "Yes" : "No"}</td>
              <td>
                <button className="btn-edit" onClick={() => setEditProduct(p)}>
                  Edit
                </button>
                <button
                  className="btn-toggle"
                  onClick={() => handleToggleVisible(p.id, p.visible)}
                >
                  {p.visible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Improved Edit Modal */}
      {editProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Product</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave();
              }}
              className="form-box"
            >
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  required
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
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Main Category:</label>
                <select
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value,
                      sub_category: "",
                    })
                  }
                >
                  <option value="smart_devices">Smart Devices</option>
                  <option value="mobiles_tablets">Mobiles Tablets</option>
                  <option value="woman_fashion">Woman Fashion</option>
                  <option value="man_fashion">Man Fashion</option>
                  <option value="kids">Kids</option>
                  <option value="automotive">Automotive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Sub Category:</label>
                <select
                  value={editProduct.sub_category || ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      sub_category: e.target.value,
                    })
                  }
                >
                  <option value="">-- Select Sub Category --</option>
                  {subCategories[editProduct.category]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Image:</label>
                <div className="image-preview">
                  {editProduct.imageFile ? (
                    <img
                      src={URL.createObjectURL(editProduct.imageFile)}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : editProduct.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${editProduct.image}`}
                      alt="Current"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <p>No image selected</p>
                  )}
                </div>
                <input
                  type="file"
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      imageFile: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-edit">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
