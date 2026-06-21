const { Router } = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, me);

module.exports = router;
