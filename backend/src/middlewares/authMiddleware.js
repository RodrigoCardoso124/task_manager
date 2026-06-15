const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Procurar o crachá (token) no cabeçalho (header) do pedido
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Acesso negado. Nenhum token foi fornecido.' });
    }

    // 2. O formato correto enviado pelo Thunder Client/Frontend é "Bearer meutoken123"
    // Vamos separar a palavra "Bearer" do token em si
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ erro: 'Formato de token inválido.' });
    }

    const token = parts[1];

    try {
        // 3. O segurança verifica se o crachá é verdadeiro usando a Chave Secreta do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Se for verdadeiro, guardamos os dados do utilizador no "req" para os Controllers poderem usar
        req.user = decoded;
        
        // 5. A palavra mágica "next()" diz ao Express: "Pode passar para o destino final!"
        next();
    } catch (error) {
        // Se a assinatura for falsa ou o tempo (2h) tiver passado, apanhamos aqui
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
};

module.exports = authMiddleware;