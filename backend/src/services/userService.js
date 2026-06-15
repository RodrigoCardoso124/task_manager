const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class UserService {
    
    // 1. REGISTAR UTILIZADOR (O método que tinha desaparecido!)
    async registerUser(name, email, password) {
        // Validações básicas
        if (!name || !email || !password) {
            throw new Error('Todos os campos (nome, email e password) são obrigatórios.');
        }

        // Verificar se o email já está registado
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('Este email já está a ser utilizado.');
        }

        // Encriptar a password (segurança máxima)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Criar o utilizador na Base de Dados através do repositório
        return await userRepository.createUser(name, email, passwordHash);
    }

    // 2. LOGIN DO UTILIZADOR
    async loginUser(email, password) {
        // Procurar o utilizador pelo email na base de dados
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Email ou password incorretos.'); 
        }

        // Comparar a password digitada com a password encriptada
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Email ou password incorretos.');
        }

        // Fabricar o Token JWT (Crachá VIP)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // O token perde a validade ao fim de 2 horas
        );

        // Devolver a informação do utilizador e o token
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        };
    }
}

module.exports = new UserService();