const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes'); // 1. IMPORTADO: Rotas de tarefas

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes); // 2. ADICIONADO: Caminho para as tarefas

app.get('/', (req, res) => {
    res.json({ mensagem: 'Bem-vindo à API do Sistema de Gestão de Tarefas!' });
});

// Criamos uma função assíncrona para garantir a ordem correta
const startServer = async () => {
    // 1. Primeiro tenta ligar à Base de Dados
    const isConnected = await connectDB();
    
    // 2. Só se ligar com sucesso é que o servidor abre as portas
    if (isConnected) {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor a correr com sucesso na porta ${PORT}`);
        });
    } else {
        console.error('❌ Não foi possível iniciar o servidor porque a ligação à BD falhou.');
    }
    
};

startServer();