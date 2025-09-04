import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryPlace, setDeliveryPlace] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(5);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Calculate totals
  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );
  const totalPrice = (itemsTotal + Number(deliveryFee || 0)).toFixed(2);

  const handleCheckout = async () => {
    if (!deliveryPlace.trim()) {
      alert("Please enter a delivery address");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ✅ Prepare items for backend
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,               // backend expects product_id
        quantity: item.quantity || 1,
        unit_price: Number(item.price),    // backend expects unit_price
      }));

      // ✅ Use snake_case keys (backend expects these)
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          delivery_place: deliveryPlace.trim(),
          delivery_fee: Number(deliveryFee || 0),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to place order");

      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Your Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <img src={item.image} alt={item.name} width="80" />
              <p>
                {item.name} - ${Number(item.price).toFixed(2)} x{" "}
                {item.quantity || 1}
              </p>
            </div>
          ))}

          <div className="checkout-inputs">
            <label>
              Delivery Place:
              <input
                type="text"
                value={deliveryPlace}
                onChange={(e) => setDeliveryPlace(e.target.value)}
                placeholder="Enter your address"
                required
              />
            </label>

            <label>
              Delivery Fee ($):
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                min="0"
              />
            </label>
          </div>

          <div className="checkout-totals">
            <p>Items Total: ${itemsTotal.toFixed(2)}</p>
            <p>Delivery Fee: ${Number(deliveryFee).toFixed(2)}</p>
            <p>
              <strong>Total: ${totalPrice}</strong>
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="checkout-button"
            disabled={!deliveryPlace.trim() || cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
