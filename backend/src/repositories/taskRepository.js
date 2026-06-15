// Importa a tua ligação à base de dados (verifica se o caminho está correto para o teu projeto)
const db = require('../config/db'); 

class TaskRepository {
    
    // 1. CREATE - Criar uma nova tarefa
    async createTask(userId, title, description) {
        // Dependendo de como tens configurado o teu db.js para o SQL Server,
        // a forma de passar parâmetros pode variar (usando @param ou ?). 
        // Aqui assumimos um formato genérico que costuma ser usado em wrappers de SQL.
        const query = `
            INSERT INTO tasks (user_id, title, description) 
            OUTPUT INSERTED.* VALUES (@userId, @title, @description)
        `;
        
        // Se estiveres a usar o pacote 'mssql' diretamente, a lógica costuma ser:
        const result = await db.request()
            .input('userId', userId)
            .input('title', title)
            .input('description', description)
            .query(query);

        return result.recordset[0]; 
    }

    // 2. READ - Buscar todas as tarefas de um utilizador específico
    async getTasksByUserId(userId) {
        const query = `SELECT * FROM tasks WHERE user_id = @userId ORDER BY created_at DESC`;
        
        const result = await db.request()
            .input('userId', userId)
            .query(query);

        return result.recordset; // Devolve um array de tarefas
    }

    // 3. UPDATE - Atualizar o título, descrição ou estado de uma tarefa
    async updateTask(taskId, userId, title, description, status) {
        const query = `
            UPDATE tasks 
            SET title = @title, description = @description, status = @status, updated_at = GETDATE()
            OUTPUT INSERTED.*
            WHERE id = @taskId AND user_id = @userId
        `;

        const result = await db.request()
            .input('title', title)
            .input('description', description)
            .input('status', status)
            .input('taskId', taskId)
            .input('userId', userId) // Garantir que a tarefa pertence a quem a tenta alterar
            .query(query);

        return result.recordset[0];
    }

    // 4. DELETE - Apagar uma tarefa
    async deleteTask(taskId, userId) {
        const query = `DELETE FROM tasks WHERE id = @taskId AND user_id = @userId`;
        
        const result = await db.request()
            .input('taskId', taskId)
            .input('userId', userId)
            .query(query);

        // Devolvemos o número de linhas afetadas (deve ser 1 se apagou com sucesso)
        return result.rowsAffected[0]; 
    }
}

module.exports = new TaskRepository();