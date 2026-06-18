import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [erro, setErro] = useState('');

    // Novos estados para o formulário de criar tarefa
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const response = await api.get('/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            setErro('Erro ao carregar as tarefas. O token pode ter expirado.');
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    // Nova função para criar a tarefa
    const handleCreateTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await api.post('/tasks',
                { title, description, dueDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Limpar o formulário após criar
            setTitle('');
            setDescription('');
            setDueDate('');

            // Atualizar a lista chamando o fetchTasks novamente
            fetchTasks();
        } catch (error) {
            alert('Erro ao criar a tarefa. Verifica os dados.');
        }
    };

    // Nova função para apagar a tarefa
    const handleDeleteTask = async (id) => {
        // Um pequeno aviso para o utilizador não apagar sem querer
        if (!window.confirm('Tens a certeza que queres apagar esta tarefa?')) return;

        const token = localStorage.getItem('token');

        try {
            await api.delete(`/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Atualiza a lista para a tarefa desaparecer do ecrã
            fetchTasks();
        } catch (error) {
            alert('Erro ao apagar a tarefa.');
        }
    };

    // Nova função para marcar a tarefa como concluída
    const handleCompleteTask = async (task) => {
        const token = localStorage.getItem('token');

        try {
            // Fazemos um PUT a enviar os dados atuais, mas mudamos o status para 'completed'
            await api.put(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                status: 'completed',
                dueDate: task.due_date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Atualiza a lista para veres a mudança de estado
            fetchTasks();
        } catch (error) {
            alert('Erro ao atualizar a tarefa.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>As Minhas Tarefas</h2>
                <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Sair
                </button>
            </div>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {/* NOVO: Formulário para criar tarefa */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '5px', marginTop: '20px', border: '1px solid #ddd' }}>
                <h3>Adicionar Nova Tarefa</h3>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Título (ex: Estudar Node)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ padding: '8px', flex: '1 1 200px' }}
                    />
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ padding: '8px', flex: '1 1 200px' }}
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        style={{ padding: '8px' }}
                    />
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Criar
                    </button>
                </form>
            </div>

            {/* Lista das tarefas */}
            <div style={{ marginTop: '30px' }}>
                {tasks.length === 0 ? (
                    <p>Ainda não tens tarefas criadas.</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {tasks.map((task) => (
                            <li key={task.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>{task.title}</h3>
                                <p style={{ margin: '0 0 10px 0', color: '#555' }}>{task.description}</p>
                                <small><strong>Estado:</strong> {task.status} | <strong>Prazo:</strong> {task.due_date ? task.due_date.split('T')[0] : 'Sem prazo'}</small>

                                {/* Botões de Ação */}
                                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>

                                    {/* Botão de Concluir (Só aparece se o status não for 'completed') */}
                                    {task.status !== 'completed' && (
                                        <button
                                            onClick={() => handleCompleteTask(task)}
                                            style={{ padding: '5px 10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                        >
                                            ✔ Concluir
                                        </button>
                                    )}

                                    {/* Botão de Apagar */}
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        🗑️ Apagar Tarefa
                                    </button>
                                </div>
                            </li>

                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Tasks;