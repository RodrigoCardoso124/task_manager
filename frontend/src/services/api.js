import axios from 'axios';

// Criamos uma instância do axios com o endereço base do nosso backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;