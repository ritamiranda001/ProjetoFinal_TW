const db = require('./db');

const Favorite = {
  findAllByUser(userId) {
    return db.prepare('SELECT * FROM favorites WHERE user_id = ?').all(userId);
  },
  findOne(userId, mealId) {
    return db.prepare('SELECT id FROM favorites WHERE user_id = ? AND meal_id = ?').get(userId, mealId);
  },
  create(userId, mealId, mealName, mealThumb) {
    return db
      .prepare('INSERT INTO favorites (user_id, meal_id, meal_name, meal_thumb) VALUES (?, ?, ?, ?)')
      .run(userId, mealId, mealName, mealThumb || null);
  },
  remove(userId, mealId) {
    return db.prepare('DELETE FROM favorites WHERE user_id = ? AND meal_id = ?').run(userId, mealId);
  }
};

module.exports = Favorite;
