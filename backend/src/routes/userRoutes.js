const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 1. Importamos o nosso segurança
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

// ROTA NOVA: Colocamos o "authMiddleware" no meio, antes de chamar o controller!
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;