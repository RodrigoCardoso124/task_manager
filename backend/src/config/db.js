const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Necessário se não estiveres a usar Azure
        trustServerCertificate: true // Essencial para o SQL Server local
    }
};

const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('✅ Ligação ao SQL Server estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao ligar ao SQL Server:', error);
    }
};

module.exports = { sql, connectDB };