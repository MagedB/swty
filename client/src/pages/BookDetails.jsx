import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Books.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found</p>;

  const info = book.volumeInfo;
  const price = book.saleInfo?.listPrice?.amount || (10 + Math.floor(Math.random() * 20));
  const thumbnail =
    info.imageLinks?.thumbnail ||
    "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <div className="book-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="book-details">
        <img src={thumbnail} alt={info.title} />
        <div className="book-info">
          <h2>{info.title}</h2>
          <p className="book-author">
            {info.authors ? info.authors.join(", ") : "Unknown"}
          </p>
          <p className="book-published">{info.publishedDate}</p>
          <p className="book-description">{info.description || "No description available."}</p>
          <p className="book-price">Price: ${price}</p>
          <div className="book-actions">
            <button className="add-cart-btn">Add to Cart</button>
            <button className="wishlist-btn">Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
