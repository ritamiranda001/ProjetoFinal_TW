const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password deve ter pelo menos 8 caracteres' });
  }
  if (User.findByEmail(email)) {
    return res.status(409).json({ message: 'Email já registado' });
  }

  const hashed = await bcrypt.hash(password, 10);
  User.create(name, email, hashed);

  res.status(201).json({ message: 'Conta criada com sucesso' });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios' });
  }

  const user = User.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'recipes-secret-key',
    { expiresIn: '2h' }
  );

  res.json({
    message: 'Login com sucesso',
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
