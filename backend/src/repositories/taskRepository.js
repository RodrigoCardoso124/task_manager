// Importa a tua ligação à base de dados (verifica se o caminho está correto para o teu projeto)
const db = require('../config/db'); 

class TaskRepository {
    
    // 1. CREATE - Criar uma nova tarefa
    async createTask(userId, title, description, dueDate) {
        const query = `
            INSERT INTO tasks (user_id, title, description, due_date) 
            OUTPUT INSERTED.* VALUES (@userId, @title, @description, @dueDate)
        `;
        
        const result = await db.request()
            .input('userId', userId)
            .input('title', title)
            .input('description', description || null)
            .input('dueDate', dueDate || null) // Passa a data ou null se não for preenchida
            .query(query);

        return result.recordset[0]; 
    }

    // 2. READ - Buscar todas as tarefas de um utilizador específico
    // 2. READ - Buscar tarefas com filtros opcionais (status e pesquisa)
    async getTasksByUserId(userId, status, search) {
        // Criamos uma query inteligente que ignora o filtro se ele for NULL
        const query = `
            SELECT * FROM tasks 
            WHERE user_id = @userId 
              AND (@status IS NULL OR status = @status)
              AND (@search IS NULL OR title LIKE '%' + @search + '%' OR description LIKE '%' + @search + '%')
            ORDER BY created_at DESC
        `;
        
        const result = await db.request()
            .input('userId', userId)
            // Se o status ou search vierem vazios/undefined, passamos null para o SQL
            .input('status', status || null)
            .input('search', search || null)
            .query(query);

        return result.recordset;
    }
    // 3. UPDATE - Atualizar o título, descrição ou estado de uma tarefa
    async updateTask(taskId, userId, title, description, status, dueDate) {
        const query = `
            UPDATE tasks 
            SET title = @title, description = @description, status = @status, due_date = @dueDate, updated_at = GETDATE()
            OUTPUT INSERTED.*
            WHERE id = @taskId AND user_id = @userId
        `;

        const result = await db.request()
            .input('title', title)
            .input('description', description || null)
            .input('status', status)
            .input('dueDate', dueDate || null)
            .input('taskId', taskId)
            .input('userId', userId)
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