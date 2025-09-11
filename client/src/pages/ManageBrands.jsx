import React, { useEffect, useState } from "react";
import "./ManageBlogs.css"; // reuse same styles

export default function ManageBrands() {
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/brands");
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleNewBrand = () => {
    setEditingBrand(null);
    setForm({ name: "", description: "", website: "" });
    setLogoFile(null);
    setShowForm(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      description: brand.description || "",
      website: brand.website || "",
    });
    setLogoFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("website", form.website);

      if (logoFile) formData.append("logo", logoFile);

      const url = editingBrand
        ? `http://localhost:5000/api/brands/${editingBrand.id}`
        : "http://localhost:5000/api/brands";

      const method = editingBrand ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save brand");

      setShowForm(false);
      fetchBrands();
    } catch (err) {
      console.error("Error saving brand:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/brands/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete brand");
      fetchBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  return (
    <div className="manage-container">
      <h1>Manage Brands</h1>

      {!showForm ? (
        <>
          <button onClick={handleNewBrand} style={{ marginBottom: "1rem" }}>
            ➕ Add Brand
          </button>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Website</th>
                <th>Logo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td>{brand.name}</td>
                  <td>{brand.description || "—"}</td>
                  <td>
                    {brand.website ? (
                      <a href={brand.website} target="_blank" rel="noreferrer">
                        {brand.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {brand.logo_url ? (
                      <img
                        src={`http://localhost:5000/uploads/brands/${brand.logo_url}`}
                        alt={brand.name}
                        width="60"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(brand)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(brand.id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="brand-editor">
          <h2>{editingBrand ? "Edit Brand" : "New Brand"}</h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="brand-form"
          >
            <div className="form-group">
              <label htmlFor="name">Brand Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter brand name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Short description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="https://example.com"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo">Brand Logo</label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingBrand ? "Update Brand" : "Add Brand"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
