const Database = require('better-sqlite3');

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

module.exports = db;
