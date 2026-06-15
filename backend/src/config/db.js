const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: '127.0.0.1', 
    database: process.env.DB_NAME,
    // Retirámos a linha da port: 1433 para o Express descobrir a porta dinâmica sozinho
    options: {
        encrypt: false, 
        trustServerCertificate: true,
    }
};

const connectDB = async () => {
    try {
        global.dbPool = await sql.connect(dbConfig);
        console.log('✅ Ligação ao SQL Server estabelecida com sucesso!');
        return true; // <--- Adiciona isto
    } catch (error) {
        console.error('❌ Erro ao ligar ao SQL Server:', error);
        return false; // <--- Adiciona isto
    }
};

module.exports = { sql, connectDB };