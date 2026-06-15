const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota para o registo: POST http://localhost:5000/api/users/register
router.post('/register', userController.register);

module.exports = router;