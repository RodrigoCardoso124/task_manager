const sql = require('mssql');

class UserRepository {
    async findByEmail(email) {
        // Usar a pool global ativa
        const request = global.dbPool.request();
        request.input('email', sql.VarChar, email);
        
        const result = await request.query('SELECT * FROM Users WHERE email = @email');
        return result.recordset[0];
    }

    async create(name, email, passwordHash) {
        // Usar a pool global ativa
        const request = global.dbPool.request();
        request.input('name', sql.VarChar, name);
        request.input('email', sql.VarChar, email);
        request.input('password_hash', sql.VarChar, passwordHash);

        const result = await request.query(`
            INSERT INTO Users (name, email, password_hash)
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
            VALUES (@name, @email, @password_hash)
        `);

        return result.recordset[0];
    }
}

module.exports = new UserRepository();