const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// ─── DATABASE SETUP ──────────────────────────────────────────────────────────
//
// NOTA: Este ficheiro usa 'better-sqlite3' (síncrono, recomendado pelo professor).
// Para instalar localmente:  npm install better-sqlite3
// Depois substitui o bloco abaixo pelo seguinte:
//
//   const Database = require('better-sqlite3');
//   const db = new Database('database.db');
//
// ─────────────────────────────────────────────────────────────────────────────
const initSqlJs = require('sql.js');
let db;

async function initDb() {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      meal_id TEXT NOT NULL,
      meal_name TEXT NOT NULL,
      meal_thumb TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, meal_id)
    )
  `);
}

// Helpers para simular a API síncrona do better-sqlite3
function dbGet(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

function dbAll(sql, params = []) {
  const results = [];
  const stmt = db.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function dbRun(sql, params = []) {
  db.run(sql, params);
}

// ─── APP SETUP ───────────────────────────────────────────────────────────────
const app = express();
const PORT = 3000;
const JWT_SECRET = 'recipes-secret-key-change-in-production';
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

app.use(cors());
app.use(express.json());

// ─── SWAGGER ─────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipes API',
      version: '1.0.0',
      description: 'API de receitas com autenticação JWT e integração com TheMealDB'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /:
 *   get:
 *     summary: Verificar se a API está a funcionar
 *     responses:
 *       200:
 *         description: API online
 */
app.get('/', (req, res) => {
  res.json({ message: 'Recipes API is running 🍽️' });
});

// ═════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Criar uma nova conta de utilizador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ana Silva
 *               email:
 *                 type: string
 *                 example: ana@test.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 *       400:
 *         description: Campos em falta ou password fraca
 *       409:
 *         description: Email já registado
 */
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e password são obrigatórios' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'A password deve ter pelo menos 8 caracteres' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de email inválido' });
  }

  const existingUser = dbGet('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUser) {
    return res.status(409).json({ message: 'Este email já está registado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  dbRun('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

  res.status(201).json({ message: 'Conta criada com sucesso' });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login com email e password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ana@test.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login com sucesso, retorna token JWT
 *       400:
 *         description: Campos em falta
 *       401:
 *         description: Credenciais inválidas
 */
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios' });
  }

  const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login com sucesso',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter informações do utilizador autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do utilizador
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 */
app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ message: 'Dados protegidos', user: req.user });
});

// ═════════════════════════════════════════════════════════════════════════════
// RECIPES ROUTES (proxy para TheMealDB)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /recipes/search:
 *   get:
 *     summary: Pesquisar receitas por nome
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: chicken
 *     responses:
 *       200:
 *         description: Lista de receitas encontradas
 *       400:
 *         description: Parâmetro q em falta
 */
app.get('/recipes/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Parâmetro de pesquisa "q" é obrigatório' });
  }

  try {
    const response = await fetch(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(q)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contactar a TheMealDB' });
  }
});

/**
 * @swagger
 * /recipes/category/{category}:
 *   get:
 *     summary: Pesquisar receitas por categoria
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         example: Seafood
 *     responses:
 *       200:
 *         description: Lista de receitas da categoria
 */
app.get('/recipes/category/:category', async (req, res) => {
  const { category } = req.params;

  try {
    const response = await fetch(`${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contactar a TheMealDB' });
  }
});

/**
 * @swagger
 * /recipes/categories:
 *   get:
 *     summary: Obter todas as categorias de receitas
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
app.get('/recipes/categories', async (req, res) => {
  try {
    const response = await fetch(`${MEALDB_BASE}/categories.php`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contactar a TheMealDB' });
  }
});

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Obter detalhes de uma receita por ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "52772"
 *     responses:
 *       200:
 *         description: Detalhes da receita
 *       404:
 *         description: Receita não encontrada
 */
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals) {
      return res.status(404).json({ message: 'Receita não encontrada' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contactar a TheMealDB' });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// FAVORITES ROUTES (protegidas — requer login)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Listar receitas favoritas do utilizador autenticado
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos
 *       401:
 *         description: Token não fornecido
 */
app.get('/favorites', authenticateToken, (req, res) => {
  const favorites = dbAll(
    'SELECT * FROM favorites WHERE user_id = ? ORDER BY id DESC',
    [req.user.id]
  );
  res.json({ favorites });
});

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Adicionar uma receita aos favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meal_id
 *               - meal_name
 *             properties:
 *               meal_id:
 *                 type: string
 *                 example: "52772"
 *               meal_name:
 *                 type: string
 *                 example: Teriyaki Chicken Casserole
 *               meal_thumb:
 *                 type: string
 *                 example: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg"
 *     responses:
 *       201:
 *         description: Adicionado aos favoritos
 *       400:
 *         description: Campos em falta
 *       409:
 *         description: Receita já nos favoritos
 */
app.post('/favorites', authenticateToken, (req, res) => {
  const { meal_id, meal_name, meal_thumb } = req.body;

  if (!meal_id || !meal_name) {
    return res.status(400).json({ message: 'meal_id e meal_name são obrigatórios' });
  }

  const existing = dbGet(
    'SELECT id FROM favorites WHERE user_id = ? AND meal_id = ?',
    [req.user.id, meal_id]
  );

  if (existing) {
    return res.status(409).json({ message: 'Receita já está nos favoritos' });
  }

  dbRun(
    'INSERT INTO favorites (user_id, meal_id, meal_name, meal_thumb) VALUES (?, ?, ?, ?)',
    [req.user.id, meal_id, meal_name, meal_thumb || null]
  );

  res.status(201).json({ message: 'Receita adicionada aos favoritos' });
});

/**
 * @swagger
 * /favorites/{meal_id}:
 *   delete:
 *     summary: Remover uma receita dos favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meal_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "52772"
 *     responses:
 *       200:
 *         description: Removido dos favoritos
 *       404:
 *         description: Favorito não encontrado
 */
app.delete('/favorites/:meal_id', authenticateToken, (req, res) => {
  const { meal_id } = req.params;

  const existing = dbGet(
    'SELECT id FROM favorites WHERE user_id = ? AND meal_id = ?',
    [req.user.id, meal_id]
  );

  if (!existing) {
    return res.status(404).json({ message: 'Receita não encontrada nos favoritos' });
  }

  dbRun(
    'DELETE FROM favorites WHERE user_id = ? AND meal_id = ?',
    [req.user.id, meal_id]
  );

  res.json({ message: 'Receita removida dos favoritos' });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🍽️  Recipes API running on http://localhost:${PORT}`);
    console.log(`📖  Swagger UI: http://localhost:${PORT}/api-docs`);
  });
});