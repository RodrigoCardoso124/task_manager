const userService = require('../services/userService');

class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Validação simples para garantir que nenhum campo vem vazio
            if (!name || !email || !password) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
            }

            // Chamar o serviço para registar o utilizador
            const newUser = await userService.registerUser(name, email, password);

            // Responder com o estatuto 201 (Created) e os dados do novo utilizador
            return res.status(201).json({
                mensagem: 'Utilizador registado com sucesso!',
                utilizador: newUser
            });

        } catch (error) {
            // Se o serviço mandar um erro (ex: email já existe), apanhamos aqui
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new UserController();