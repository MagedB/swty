// frontend/src/api/api.js

const BASE_URL = "http://localhost:5000/api"; // backend server

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // if backend sends error message in JSON
    let errorMessage = "API error";
    try {
      const err = await response.json();
      errorMessage = err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return response.json();
}

export default apiFetch;
