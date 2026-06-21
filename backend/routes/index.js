const { Router } = require('express');
const authRoutes = require('./auth.routes');
const favoritesRoutes = require('./favorites.routes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'API a funcionar' });
});

router.use('/auth', authRoutes);
router.use('/favorites', favoritesRoutes);

module.exports = router;
