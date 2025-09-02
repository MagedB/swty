import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; // Make sure this exists

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Registration failed");
      }

      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register</h1>
      <form className="register-form" onSubmit={handleRegister}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="register-error">{error}</p>}
        <button type="submit" className="register-button">Register</button>
      </form>

      <p className="register-login">
        Already have an account? <Link to="/login">Login here</Link>
      </p>

      <div className="register-social">
        <button className="google-btn" disabled>Register with Google</button>
        <button className="facebook-btn" disabled>Register with Facebook</button>
      </div>
    </div>
  );
}
