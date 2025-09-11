// src/pages/ManageSuppliers.jsx
import React, { useEffect, useState } from "react";
import "./ManageBlogs.css"; // reuse the same base styles

export default function ManageSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    commercial_register: "",
    tax_id: "",
    bank_account: "",
    payment_terms: "",
    notes: "",
  });

  // ✅ Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add new supplier
  const handleNew = () => {
    setEditingSupplier(null);
    setForm({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      commercial_register: "",
      tax_id: "",
      bank_account: "",
      payment_terms: "",
      notes: "",
    });
    setShowForm(true);
  };

  // ✅ Edit supplier
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name || "",
      contact_person: supplier.contact_person || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      city: supplier.city || "",
      country: supplier.country || "",
      commercial_register: supplier.commercial_register || "",
      tax_id: supplier.tax_id || "",
      bank_account: supplier.bank_account || "",
      payment_terms: supplier.payment_terms || "",
      notes: supplier.notes || "",
    });
    setShowForm(true);
  };

  // ✅ Submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSupplier
        ? `http://localhost:5000/api/suppliers/${editingSupplier.id}`
        : "http://localhost:5000/api/suppliers";

      const method = editingSupplier ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save supplier");

      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);
    }
  };

  // ✅ Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/suppliers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete supplier");
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  return (
    <div className="manage-container">
      <h1>Manage Suppliers</h1>

      {!showForm ? (
        <>
          <button className="primary-btn" onClick={handleNew} style={{ marginBottom: "1rem" }}>
            ➕ Add Supplier
          </button>

          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.contact_person || "—"}</td>
                  <td>{s.email || "—"}</td>
                  <td>{s.phone || "—"}</td>
                  <td>{s.city || "—"}</td>
                  <td>{s.country || "—"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(s)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(s.id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="brand-editor">
          <h2>{editingSupplier ? "Edit Supplier" : "New Supplier"}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input type="text" name="name" placeholder="Supplier Name *" value={form.name} onChange={handleChange} required />
            <input type="text" name="contact_person" placeholder="Contact Person" value={form.contact_person} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} />
            <input type="text" name="commercial_register" placeholder="Commercial Register" value={form.commercial_register} onChange={handleChange} />
            <input type="text" name="tax_id" placeholder="Tax ID" value={form.tax_id} onChange={handleChange} />
            <input type="text" name="bank_account" placeholder="Bank Account" value={form.bank_account} onChange={handleChange} />
            <input type="text" name="payment_terms" placeholder="Payment Terms" value={form.payment_terms} onChange={handleChange} />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              style={{ gridColumn: "1 / -1", minHeight: "80px" }}
            />

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingSupplier ? "Update Supplier" : "Add Supplier"}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
