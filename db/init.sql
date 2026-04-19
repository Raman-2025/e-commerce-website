CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  stock_qty INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_amount NUMERIC(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT,
  price_at_purchase NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Sample skincare products
INSERT INTO products (name, description, price, image_url, category, stock_qty) VALUES
('Vitamin C Serum', 'Brightening serum with 20% Vitamin C', 899.00, '../images/serum1.png', 'serum', 50),
('Hydrating Moisturizer', 'Deep hydration for all skin types', 699.00, '../images/moisture1.png', 'moisturizer', 40),
('SPF 50 Sunscreen', 'Broad spectrum UV protection', 499.00, '../images/sunscreen1.png', 'sunscreen', 60),
('Gentle Face Wash', 'Sulfate-free daily cleanser', 349.00, '../images/facewash1.png', 'facewash', 80);
