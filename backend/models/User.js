const db = require('./db');

const User = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  create(name, email, hashedPassword) {
    return db
      .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
      .run(name, email, hashedPassword);
  }
};

module.exports = User;
