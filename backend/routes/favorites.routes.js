const { Router } = require('express');
const { list, add, remove } = require('../controllers/favorites.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticateToken);

router.get('/', list);
router.post('/', add);
router.delete('/:meal_id', remove);

module.exports = router;
