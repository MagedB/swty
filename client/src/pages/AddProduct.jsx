// src/pages/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Table.css"; // ✅ reuse global styles

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("smart_devices");
  const [subCategory, setSubCategory] = useState("");
  const [brandId, setBrandId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const navigate = useNavigate();

  // ✅ category → subcategory map
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

  // ✅ role check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !["admin", "moderator"].includes(user.role)) {
      alert("You do not have permission to add products");
      navigate("/");
    }
  }, [navigate]);

  // ✅ fetch data
  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      // 🔑 Normalize keys
      const normalized = data.map((p) => ({
        ...p,
        subCategory: p.sub_category,
        brandName: p.brand_name || null,
        supplierName: p.supplier_name || null,
      }));

      setProducts(normalized.sort((a, b) => b.id - a.id).slice(0, 50));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      setBrands(await res.json());
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/suppliers");
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      setSuppliers(await res.json());
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !subCategory || !image) {
      alert("Please fill all fields and select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("sub_category", subCategory);
      formData.append("brand_id", brandId || null);
      formData.append("supplier_id", supplierId || null);
      formData.append("image", image);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");

      alert("✅ Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("smart_devices");
      setSubCategory("");
      setBrandId("");
      setSupplierId("");
      setImage(null);
      setPreview(null);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product: " + err.message);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    setEditPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleEditSave = async () => {
    if (!editProduct) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editProduct.name);
      formData.append("description", editProduct.description);
      formData.append("price", editProduct.price);
      formData.append("category", editProduct.category);
      formData.append("sub_category", editProduct.subCategory || "");
      formData.append("brand_id", editProduct.brand_id || null);
      formData.append("supplier_id", editProduct.supplier_id || null);
      if (editImage) formData.append("image", editImage);

      const res = await fetch(
        `http://localhost:5000/api/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update product");

      alert("✅ Product updated successfully!");
      setEditProduct(null);
      setEditImage(null);
      setEditPreview(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="manage-container">
      <h1 className="table-title">Add Product</h1>

      <div className="form-container">
        {/* Left - Form */}
        <form onSubmit={handleSubmit} className="form-box">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Main Category:</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
              }}
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
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
            >
              <option value="">-- Select Sub Category --</option>
              {subCategories[category]?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Brand dropdown */}
          <div className="form-group">
            <label>Brand:</label>
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              <option value="">-- Select Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Supplier dropdown */}
          <div className="form-group">
            <label>Supplier:</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
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
          {preview ? <img src={preview} alt="Preview" /> : <p>No image selected</p>}
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
            <th>Sub Category</th>
            <th>Brand</th>
            <th>Supplier</th>
            <th>Image</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
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
              <td>{p.subCategory || "-"}</td>
              <td>{p.brandName || "-"}</td>
              <td>{p.supplierName || "-"}</td>
              <td>
                {p.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    alt={p.name}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                  />
                ) : (
                  "—"
                )}
              </td>
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
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Main Category:</label>
              <select
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value, subCategory: "" })
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
                value={editProduct.subCategory || ""}
                onChange={(e) => setEditProduct({ ...editProduct, subCategory: e.target.value })}
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
              <label>Brand:</label>
              <select
                value={editProduct.brand_id || ""}
                onChange={(e) => setEditProduct({ ...editProduct, brand_id: e.target.value })}
              >
                <option value="">-- Select Brand --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Supplier:</label>
              <select
                value={editProduct.supplier_id || ""}
                onChange={(e) => setEditProduct({ ...editProduct, supplier_id: e.target.value })}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Image:</label>
              <input type="file" onChange={handleEditImageChange} accept="image/*" />
              <div className="image-preview">
                {editPreview ? (
                  <img src={editPreview} alt="Preview" />
                ) : editProduct.image ? (
                  <img src={`http://localhost:5000/uploads/${editProduct.image}`} alt={editProduct.name} />
                ) : (
                  <p>No image</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-edit" onClick={handleEditSave}>
                Save
              </button>
              <button
                className="btn-delete"
                onClick={() => {
                  setEditProduct(null);
                  setEditImage(null);
                  setEditPreview(null);
                }}
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
