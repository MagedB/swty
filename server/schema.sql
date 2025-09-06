-- Drop existing tables (for dev only)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- =====================
-- Users
-- =====================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ====================
-- Products
-- =====================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Orders
-- =====================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delivery_place TEXT NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  status varchar(20) DEFAULT 'pending',
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- Order Items
-- =====================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL
);
-- =====================
-- Blogs
-- =====================
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  author VARCHAR(100),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
