const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

class UserService {
    async registerUser(name, email, password) {
        // 1. Verificar se o email já está registado
        const userExists = await userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('Este email já está a ser utilizado.');
        }

        // 2. Encriptar a password (Segurança em primeiro lugar!)
        // O número 10 é o "salt", que define a complexidade da encriptação
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Mandar o repositório guardar o utilizador na BD
        const newUser = await userRepository.create(name, email, passwordHash);

        return newUser;
    }
}

module.exports = new UserService();