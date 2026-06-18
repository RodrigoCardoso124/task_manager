import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Guardamos o que o utilizador escreve nestas variáveis
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Função que corre quando clicamos no botão "Entrar"
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que a página faça refresh
    setErro(''); // Limpa erros antigos

    try {
      // Fazemos o POST para o nosso backend
      const response = await api.post('/users/login', { email, password });
      
      // Se der sucesso, guardamos o Token no cofre do navegador (localStorage)
      localStorage.setItem('token', response.data.token);
      
      alert('Login feito com sucesso! O teu token está guardado.');
      // (No próximo passo vamos redirecionar para a página de tarefas)
      navigate('/tasks');

    } catch (error) {
      setErro('Erro no login. Verifica o teu email e a tua password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Bem-vindo ao Task Manager</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email:</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div>
          <label>Password:</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>

      {/* Se houver um erro, mostramos esta mensagem a vermelho */}
      {erro && <p style={{ color: 'red', marginTop: '15px' }}>{erro}</p>}
    </div>
  );
}

export default Login;