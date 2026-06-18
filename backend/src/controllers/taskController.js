const taskService = require('../services/taskService');

class TaskController {
    
    // 1. Criar Tarefa
    async create(req, res) {
        try {
            const { title, description, dueDate } = req.body;
            const userId = req.user.id; 
            
            const newTask = await taskService.createTask(userId, title, description, dueDate);
            return res.status(201).json({ mensagem: 'Tarefa criada com sucesso!', tarefa: newTask });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // 2. Listar Tarefas
    // 2. Listar Tarefas (com suporte a filtros)
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            // Apanha os query params do URL, ex: /api/tasks?status=pending&search=estudar
            const { status, search } = req.query; 
            
            const tasks = await taskService.getAllTasks(userId, status, search);
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // 3. Atualizar Tarefa
    async update(req, res) {
        try {
            const { id } = req.params; 
            const { title, description, status, dueDate } = req.body;
            const userId = req.user.id;

            const updatedTask = await taskService.updateTask(id, userId, title, description, status, dueDate);
            return res.status(200).json({ mensagem: 'Tarefa atualizada com sucesso!', tarefa: updatedTask });
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