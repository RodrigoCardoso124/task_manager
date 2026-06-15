const mssql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Usar true para Azure, false para local
        trustServerCertificate: true // Usar true para desenvolvimento local
    }
};

let pool;

const connectDB = async () => {
    try {
        pool = await mssql.connect(config);
        console.log('✅ Ligação ao SQL Server estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao ligar ao SQL Server:', error.message);
        return false;
    }
};

// Criamos um helper para o request não falhar se o pool ainda não existir
const request = () => {
    if (!pool) {
        throw new Error('A base de dados não está ligada!');
    }
    return pool.request();
};

// Exportamos o connectDB (usado no server.js) e o request (usado nos repositórios)
module.exports = {
    connectDB,
    request
};