import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Books.css";

const categories = [
  "All",
  "Fiction",
  "Non-fiction",
  "Science",
  "Technology",
  "Kids",
  "Business",
];

export default function Books() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const maxResults = 12;

  const fetchBooks = async (newIndex = 0) => {
    setLoading(true);
    try {
      let searchQuery = query || "books";
      if (selectedCategory !== "All") searchQuery += `+subject:${selectedCategory}`;
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&startIndex=${newIndex}&maxResults=${maxResults}&orderBy=relevance`
      );
      const data = await res.json();
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0);
      setStartIndex(newIndex);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(0);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    fetchBooks(0);
  };

  const handleNext = () => {
    if (startIndex + maxResults < totalItems) fetchBooks(startIndex + maxResults);
  };

  const handlePrev = () => {
    if (startIndex - maxResults >= 0) fetchBooks(startIndex - maxResults);
  };

  // ✅ Add book to main cart
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const bookInCart = cart.find((item) => item.id === book.id);

    if (bookInCart) {
      // Increase quantity
      bookInCart.quantity += 1;
    } else {
      cart.push({
        id: book.id,
        name: book.volumeInfo.title,
        price:
          book.saleInfo?.listPrice?.amount || (10 + Math.floor(Math.random() * 20)),
        image:
          book.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/140x200?text=No+Image",
        quantity: 1,
        category: "Books",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${book.volumeInfo.title} added to cart!`);
  };

  // ✅ Wishlist (optional)
  const addToWishlist = (book) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.find((item) => item.id === book.id)) {
      wishlist.push({
        id: book.id,
        name: book.volumeInfo.title,
        image:
          book.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/140x200?text=No+Image",
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`${book.volumeInfo.title} added to wishlist!`);
    } else {
      alert(`${book.volumeInfo.title} is already in wishlist!`);
    }
  };

  return (
    <div className="books-container">
      <h1>šwty Books Shop</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="book-search-form">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Categories */}
      <div className="book-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === selectedCategory ? "active" : ""}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => {
            const info = book.volumeInfo;
            const price =
              book.saleInfo?.listPrice?.amount || (10 + Math.floor(Math.random() * 20));
            const thumbnail =
              info.imageLinks?.thumbnail ||
              "https://via.placeholder.com/140x200?text=No+Image";
            const rating = info.averageRating || Math.floor(Math.random() * 5) + 1;

            return (
              <div key={book.id} className="book-card">
                <img
                  src={thumbnail}
                  alt={info.title}
                  onClick={() => navigate(`/books/${book.id}`)}
                />
                <div className="book-info">
                  <h3>{info.title}</h3>
                  <p className="book-author">
                    {info.authors ? info.authors.join(", ") : "Unknown"}
                  </p>
                  <p className="book-price">${price}</p>
                  <p className="book-rating">
                    {"★".repeat(rating) + "☆".repeat(5 - rating)}
                  </p>
                  <div className="book-actions">
                    <button onClick={() => addToCart(book)} className="add-cart-btn">
                      Add to Cart
                    </button>
                    <button onClick={() => addToWishlist(book)} className="wishlist-btn">
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {books.length > 0 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={startIndex === 0}>
            Previous
          </button>
          <span>
            {startIndex + 1} - {Math.min(startIndex + maxResults, totalItems)} of {totalItems}
          </span>
          <button onClick={handleNext} disabled={startIndex + maxResults >= totalItems}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
