
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);

      console.log('API Response:', res.data);

      const tasksData = res.data.tasks;

      if (!Array.isArray(tasksData)) {
        throw new Error('API did not return a tasks array');
      }

      setTasks(tasksData);
      setError('');
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('Unable to load tasks. Check backend connection.');
      setTasks([]);
    }
  };

  const addTask = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(API, { text: text.trim() });
      setText('');
      await fetchTasks();
    } catch (err) {
      console.error('Add task error:', err);
      setError('Unable to add task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Unable to delete task.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>To-Do List with Devops DB Test</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task"
      />

      <button onClick={addTask}>Add</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.text}
            <button onClick={() => deleteTask(task._id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
