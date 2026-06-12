const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db'); // 1. Importar a ligação

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensagem: 'Bem-vindo à API do Sistema de Gestão de Tarefas!' });
});

// 2. Ligar à base de dados antes de iniciar o servidor
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr na porta ${PORT}`);
});