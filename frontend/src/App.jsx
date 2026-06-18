import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tasks from './pages/Tasks'; // <-- Não te esqueças de importar!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Nova rota para as tarefas */}
        <Route path="/tasks" element={<Tasks />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;