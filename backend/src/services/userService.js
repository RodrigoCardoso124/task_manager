const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- Adicionamos a biblioteca aqui
const userRepository = require('../repositories/userRepository');

class UserService {
    // ... (o teu método registerUser que já tinhas continua aqui) ...

    async loginUser(email, password) {
        // 1. Procurar o utilizador pelo email na base de dados
        const user = await userRepository.findByEmail(email);
        if (!user) {
            // Nota de segurança: não especificamos se o erro foi no email ou na senha!
            throw new Error('Email ou password incorretos.'); 
        }

        // 2. Comparar a password digitada com a password encriptada
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Email ou password incorretos.');
        }

        // 3. Fabricar o Token (Crachá VIP)
        // Guardamos o ID e o email do utilizador dentro do token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // O token perde a validade ao fim de 2 horas
        );

        // 4. Devolver a informação do utilizador (mas nunca a password!) e o token
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