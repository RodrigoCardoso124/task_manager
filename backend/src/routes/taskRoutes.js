const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ao usar o router.use() aqui, obrigamos todas as rotas abaixo a passar pelo segurança!
router.use(authMiddleware);

// Rota para criar (POST) e listar (GET)
router.post('/', taskController.create);
router.get('/', taskController.getAll);

// Rota para atualizar (PUT) e apagar (DELETE). Notar o ":id" que representa a tarefa específica
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;