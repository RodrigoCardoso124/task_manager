const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para registar um novo utilizador
router.post('/register', userController.register);

// ROTA NOVA: Rota para fazer o login
router.post('/login', userController.login);

module.exports = router;