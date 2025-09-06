import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill"; // ✅ WYSIWYG editor
import "react-quill/dist/quill.snow.css"; // ✅ Quill styles

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    category: "",
    author: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle text input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Quill content change
  const handleContentChange = (value) => {
    setForm({ ...form, content: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Open editor for new blog
  const handleNewBlog = () => {
    setEditingBlog(null);
    setForm({ title: "", slug: "", content: "", category: "", author: "" });
    setImageFile(null);
    setShowEditor(true);
  };

  // Open editor for editing
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      category: blog.category,
      author: blog.author,
    });
    setImageFile(null);
    setShowEditor(true);
  };

  // Submit new or updated blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (imageFile) formData.append("image", imageFile);

      const url = editingBlog
        ? `http://localhost:5000/api/blogs/${editingBlog.id}`
        : "http://localhost:5000/api/blogs";

      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save blog");

      setShowEditor(false);
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <div className="manage-container">
      <h1>Manage Blogs</h1>

      {!showEditor ? (
        <>
          <button onClick={handleNewBlog} style={{ marginBottom: "1rem" }}>
            ➕ Add Blog
          </button>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Slug</th>
                <th>Image</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.id}</td>
                  <td>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>{blog.author}</td>
                  <td>{blog.slug}</td>
                  <td>
                    {blog.image ? (
                      <img
                        src={`http://localhost:5000/uploads/blogs/${blog.image}`}
                        alt={blog.title}
                        width="60"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(blog)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(blog.id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="blog-editor">
          <h2>{editingBlog ? "Edit Blog" : "New Blog"}</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="slug"
              placeholder="Slug (e.g. women-fashion-2025)"
              value={form.slug}
              onChange={handleChange}
              required
            />

            {/* ✅ React Quill Editor */}
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here..."
              style={{ height: "300px", marginBottom: "20px" }}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="smart-devices">Smart Devices</option>
              <option value="mobiles-tablets">Mobiles & Tablets</option>
              <option value="women-fashion">Women Fashion</option>
              <option value="men-fashion">Men Fashion</option>
              <option value="kids">Kids</option>
              <option value="automotive">Automotive</option>
            </select>

            <input
              type="text"
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button type="submit">{editingBlog ? "Update Blog" : "Add Blog"}</button>
            <button type="button" onClick={() => setShowEditor(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
