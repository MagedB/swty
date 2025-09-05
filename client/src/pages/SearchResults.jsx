import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Always point to backend
  const API_BASE = "http://localhost:5000/api";

  // Navbar sends ?query=, we also support ?q=
  const params = new URLSearchParams(location.search);
  const rawQ = params.get("query") || params.get("q") || "";

  useEffect(() => {
    if (!rawQ.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE}/products/search?q=${encodeURIComponent(rawQ)}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [rawQ]);

  return (
    <div style={{ maxWidth: 1100, margin: "30px auto", padding: "0 20px" }}>
      <h2>
        Search results for:{" "}
        <span style={{ color: "#3498db" }}>{rawQ}</span>
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>No products found matching your search.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
          marginTop: 16,
        }}
      >
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
