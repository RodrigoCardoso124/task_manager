const taskRepository = require('../repositories/taskRepository');

class TaskService {
    
    // 1. Criar tarefa com validação de regras de negócio
    async createTask(userId, title, description, dueDate) {
        if (!title || title.trim() === '') {
            throw new Error('O título da tarefa é obrigatório.');
        }
        return await taskRepository.createTask(userId, title, description, dueDate);
    }

    // 2. Procurar todas as tarefas do utilizador
    // 2. Procurar todas as tarefas do utilizador (com filtros opcionais)
    async getAllTasks(userId, status, search) {
        // Se o utilizador mandou um status, podemos validar se ele é correto
        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            throw new Error('Filtro de estado inválido. Use: pending, in_progress ou completed.');
        }

        return await taskRepository.getTasksByUserId(userId, status, search);
    }

    // 3. Atualizar uma tarefa existente
    async updateTask(taskId, userId, title, description, status, dueDate) {
        if (!title || title.trim() === '') {
            throw new Error('O título da tarefa não pode ficar vazio.');
        }

        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (status && !validStatuses.includes(status)) {
            throw new Error('Estado da tarefa inválido.');
        }

        const updatedTask = await taskRepository.updateTask(taskId, userId, title, description, status, dueDate);

        if (!updatedTask) {
            throw new Error('Tarefa não encontrada ou sem permissão.');
        }

        return updatedTask;
    }

    // 4. Apagar uma tarefa
    async deleteTask(taskId, userId) {
        const rowsAffected = await taskRepository.deleteTask(taskId, userId);

        // Se o repositório devolver 0, significa que o ID não existia ou não pertencia a este utilizador
        if (rowsAffected === 0) {
            throw new Error('Tarefa não encontrada ou não tens permissão para apagá-la.');
        }

        return { mensagem: 'Tarefa eliminada com sucesso!' };
    }
}

module.exports = new TaskService();