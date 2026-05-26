const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'recipes-secret-key';

app.use(cors());
app.use(express.json());

// ─── BASE DE DADOS ───────────────────────────────────────────────────────────
const db = new Database('database.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    meal_id TEXT NOT NULL,
    meal_name TEXT NOT NULL,
    meal_thumb TEXT,
    UNIQUE(user_id, meal_id)
  )
`);

// ─── MIDDLEWARE AUTH ──────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });

  if (password.length < 8)
    return res.status(400).json({ message: 'Password deve ter pelo menos 8 caracteres' });

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ message: 'Email já registado' });

  const hashed = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashed);

  res.status(201).json({ message: 'Conta criada com sucesso' });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email e password são obrigatórios' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login com sucesso', token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ─── FAVORITOS ────────────────────────────────────────────────────────────────
app.get('/favorites', authenticateToken, (req, res) => {
  const favorites = db.prepare('SELECT * FROM favorites WHERE user_id = ?').all(req.user.id);
  res.json({ favorites });
});

app.post('/favorites', authenticateToken, (req, res) => {
  const { meal_id, meal_name, meal_thumb } = req.body;

  if (!meal_id || !meal_name)
    return res.status(400).json({ message: 'meal_id e meal_name são obrigatórios' });

  const exists = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND meal_id = ?').get(req.user.id, meal_id);
  if (exists) return res.status(409).json({ message: 'Receita já nos favoritos' });

  db.prepare('INSERT INTO favorites (user_id, meal_id, meal_name, meal_thumb) VALUES (?, ?, ?, ?)').run(req.user.id, meal_id, meal_name, meal_thumb || null);

  res.status(201).json({ message: 'Adicionado aos favoritos' });
});

app.delete('/favorites/:meal_id', authenticateToken, (req, res) => {
  const { meal_id } = req.params;

  const exists = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND meal_id = ?').get(req.user.id, meal_id);
  if (!exists) return res.status(404).json({ message: 'Favorito não encontrado' });

  db.prepare('DELETE FROM favorites WHERE user_id = ? AND meal_id = ?').run(req.user.id, meal_id);
  res.json({ message: 'Removido dos favoritos' });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend a correr em http://localhost:${PORT}`);
});