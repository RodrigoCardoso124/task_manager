const db = require('../config/db'); 

class UserRepository {
    
    // 1. CRIAR UTILIZADOR (Garante que este método está aqui!)
    async createUser(name, email, passwordHash) {
        const query = `
            INSERT INTO users (name, email, password_hash) 
            OUTPUT INSERTED.* VALUES (@name, @email, @passwordHash)
        `;
        
        const result = await db.request()
            .input('name', name)
            .input('email', email)
            .input('passwordHash', passwordHash)
            .query(query);

        return result.recordset[0]; 
    }

    // 2. PROCURAR POR EMAIL (Usado no Login e na validação do Registo)
    async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = @email`;
        
        const result = await db.request()
            .input('email', email)
            .query(query);

        return result.recordset[0]; // Devolve o utilizador ou undefined se não encontrar
    }
}

module.exports = new UserRepository();