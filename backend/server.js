require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// ── Auth middleware ──────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── REGISTER ─────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email, hash]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// ── LOGIN ─────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PRODUCTS ──────────────────────────────────────
app.get('/api/products', async (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  if (search) { params.push(`%${search}%`); query += ` AND name ILIKE $${params.length}`; }
  if (category) { params.push(category); query += ` AND category=$${params.length}`; }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// ── CART ──────────────────────────────────────────
app.get('/api/cart', authMiddleware, async (req, res) => {
  const result = await pool.query(
    `SELECT ci.id, ci.quantity, p.name, p.price, p.image_url
     FROM cart_items ci JOIN products p ON ci.product_id=p.id
     WHERE ci.user_id=$1`,
    [req.user.id]
  );
  res.json(result.rows);
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { product_id, quantity } = req.body;
  const existing = await pool.query(
    'SELECT * FROM cart_items WHERE user_id=$1 AND product_id=$2',
    [req.user.id, product_id]
  );
  if (existing.rows.length > 0) {
    await pool.query('UPDATE cart_items SET quantity=quantity+$1 WHERE user_id=$2 AND product_id=$3',
      [quantity || 1, req.user.id, product_id]);
  } else {
    await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1,$2,$3)',
      [req.user.id, product_id, quantity || 1]);
  }
  res.json({ message: 'Added to cart' });
});

app.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM cart_items WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ message: 'Removed' });
});

// ── CONTACT ───────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  await pool.query('INSERT INTO contact_messages (name,email,message) VALUES ($1,$2,$3)', [name, email, message]);
  res.json({ message: 'Message received!' });
});

// ── START ─────────────────────────────────────────
app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
