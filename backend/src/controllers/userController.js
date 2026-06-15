const userService = require('../services/userService');

class UserController {
    // Método de registo que já tinhas criado
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

    // NOVO MÉTODO: Método de Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validação simples de segurança
            if (!email || !password) {
                return res.status(400).json({ erro: 'Email e password são obrigatórios.' });
            }

            // Chamar o serviço para validar as credenciais e gerar o token
            const result = await userService.loginUser(email, password);

            // Se correr bem, devolvemos os dados do utilizador e o token JWT
            return res.status(200).json({
                mensagem: 'Login efetuado com sucesso!',
                ...result
            });

        } catch (error) {
            // Se o email não existir ou a senha estiver errada, apanhamos o erro aqui
            return res.status(401).json({ erro: error.message });
        }
    }
}

module.exports = new UserController();