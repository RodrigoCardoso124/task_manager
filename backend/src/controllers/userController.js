const userService = require('../services/userService');

class UserController {
    // 1. Método de Registo
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
            }
            const newUser = await userService.registerUser(name, email, password);
            return res.status(201).json({
                mensagem: 'Utilizador registado com sucesso!',
                utilizador: newUser
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // 2. Método de Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ erro: 'Email e password são obrigatórios.' });
            }
            const result = await userService.loginUser(email, password);
            return res.status(200).json({
                mensagem: 'Login efetuado com sucesso!',
                ...result
            });
        } catch (error) {
            return res.status(401).json({ erro: error.message });
        }
    }

    // 3. Rota Protegida (Perfil)
    async getProfile(req, res) {
        try {
            return res.status(200).json({
                mensagem: 'Acesso autorizado! Bem-vindo à tua área VIP.',
                dadosToken: req.user
            });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro interno do servidor.' });
        }
    }
}

module.exports = new UserController();