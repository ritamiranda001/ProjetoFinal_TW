const Favorite = require('../models/Favorite');

function list(req, res) {
  const favorites = Favorite.findAllByUser(req.user.id);
  res.json({ favorites });
}

function add(req, res) {
  const { meal_id, meal_name, meal_thumb } = req.body;

  if (!meal_id || !meal_name) {
    return res.status(400).json({ message: 'meal_id e meal_name são obrigatórios' });
  }
  if (Favorite.findOne(req.user.id, meal_id)) {
    return res.status(409).json({ message: 'Receita já nos favoritos' });
  }

  Favorite.create(req.user.id, meal_id, meal_name, meal_thumb);
  res.status(201).json({ message: 'Adicionado aos favoritos' });
}

function remove(req, res) {
  const { meal_id } = req.params;

  if (!Favorite.findOne(req.user.id, meal_id)) {
    return res.status(404).json({ message: 'Favorito não encontrado' });
  }

  Favorite.remove(req.user.id, meal_id);
  res.json({ message: 'Removido dos favoritos' });
}

module.exports = { list, add, remove };
