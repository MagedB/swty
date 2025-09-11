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
  created_at TIMESTAMP DEFAULT NOW(),
  visible BOOLEAN DEFAULT TRUE,
  sub_category VARCHAR(100) NOT NULL DEFAULT ''
  
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

-- =====================
-- Supplier_brands
-- =====================

CREATE TABLE supplier_brands (
  supplier_id INT REFERENCES suppliers(id) ON DELETE CASCADE,
  brand_id INT REFERENCES brands(id) ON DELETE CASCADE,
  PRIMARY KEY (supplier_id, brand_id)
);

-- =====================
-- Brands
-- =====================    

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT
);

-- =====================
-- Suppliers
-- =====================

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,           -- Company name
  contact_person VARCHAR(100),          -- Person you deal with
  email VARCHAR(150),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  commercial_register VARCHAR(100),     -- Official CR number
  tax_id VARCHAR(100),                  -- VAT / tax number
  bank_account VARCHAR(150),            -- IBAN / account for payments
  payment_terms VARCHAR(100),           -- e.g. "Net 30", "Prepaid 50%"
  notes TEXT,                           -- internal notes for your staff
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

