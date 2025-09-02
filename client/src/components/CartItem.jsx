import React from "react";

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #ccc", padding: "10px 0" }}>
      <img
        src={item.image}
        alt={item.name}
        style={{ width: "80px", height: "80px", objectFit: "cover" }}
      />
      <div style={{ flex: 1 }}>
        <h4>{item.name}</h4>
        <p>${item.price}</p>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
          style={{ width: "60px" }}
        />
      </div>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
}
