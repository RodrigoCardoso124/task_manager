const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite receber dados em formato JSON

// Rota de Teste
app.get('/', (req, res) => {
    res.json({ mensagem: 'Bem-vindo à API do Sistema de Gestão de Tarefas!' });
});

// Iniciar o Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr na porta ${PORT}`);
});