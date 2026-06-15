const taskService = require('../services/taskService');

class TaskController {
    
    // 1. Criar Tarefa
    async create(req, res) {
        try {
            const { title, description } = req.body;
            // O nosso segurança (authMiddleware) colocou o ID do utilizador aqui!
            const userId = req.user.id; 
            
            const newTask = await taskService.createTask(userId, title, description);
            return res.status(201).json({
                mensagem: 'Tarefa criada com sucesso!',
                tarefa: newTask
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // 2. Listar Tarefas
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const tasks = await taskService.getAllTasks(userId);
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro interno ao procurar tarefas.' });
        }
    }

    // 3. Atualizar Tarefa
    async update(req, res) {
        try {
            const { id } = req.params; // O ID da tarefa vem no URL (ex: /tasks/5)
            const { title, description, status } = req.body;
            const userId = req.user.id;

            const updatedTask = await taskService.updateTask(id, userId, title, description, status);
            return res.status(200).json({
                mensagem: 'Tarefa atualizada com sucesso!',
                tarefa: updatedTask
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // 4. Apagar Tarefa
    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await taskService.deleteTask(id, userId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new TaskController();