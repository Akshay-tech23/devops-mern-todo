
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/tasks`;

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0c1020',
    color: '#f1f5f9',
    fontFamily: 'Inter, Arial, sans-serif',
    padding: '30px 20px',
  },
  container: {
    maxWidth: '950px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '45px',
  },
  brand: {
    fontSize: '25px',
    fontWeight: '800',
    color: '#a78bfa',
  },
  date: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  hero: {
    marginBottom: '35px',
  },
  eyebrow: {
    color: '#a78bfa',
    fontSize: '11px',
    letterSpacing: '2px',
    fontWeight: '700',
  },
  heading: {
    fontSize: 'clamp(32px, 6vw, 46px)',
    margin: '12px 0',
    lineHeight: '1.15',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.7',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '35px',
  },
  statCard: {
    background: '#171d31',
    border: '1px solid #29334d',
    borderRadius: '15px',
    padding: '22px',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '12px 0 5px',
  },
  panel: {
    background: '#171d31',
    border: '1px solid #29334d',
    borderRadius: '18px',
    padding: '25px',
  },
  panelTitle: {
    fontSize: '22px',
    margin: '0 0 8px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    minWidth: '180px',
    padding: '14px 16px',
    borderRadius: '9px',
    border: '1px solid #35415d',
    background: '#0c1020',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
  },
  addButton: {
    background: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    padding: '14px 22px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  task: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '17px 0',
    borderBottom: '1px solid #29334d',
  },
  taskText: {
    flex: '1',
    fontSize: '14px',
    overflowWrap: 'anywhere',
  },
  deleteButton: {
    border: 'none',
    background: '#3b202d',
    color: '#fb7185',
    padding: '8px 12px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  empty: {
    textAlign: 'center',
    padding: '45px 10px',
    color: '#94a3b8',
  },
  error: {
    color: '#fda4af',
    background: '#3b202d',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '15px',
  },
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      const tasksData = res.data.tasks;

      if (!Array.isArray(tasksData)) {
        throw new Error('Invalid tasks response');
      }

      setTasks(tasksData);
      setError('');
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('Unable to load tasks. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setAdding(true);
      await axios.post(API, { text: text.trim() });
      setText('');
      await fetchTasks();
    } catch (err) {
      console.error('Add task error:', err);
      setError('Unable to add task.');
    } finally {
      setAdding(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks((current) => current.filter((task) => task._id !== id));
      setError('');
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Unable to delete task.');
    }
  };

  // Completion is currently frontend-only.
  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task._id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const filteredTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  const buttonStyle = (selected) => ({
    padding: '9px 15px',
    borderRadius: '8px',
    border: '1px solid',
    borderColor: selected ? '#8b5cf6' : '#35415d',
    background: selected ? '#35265b' : 'transparent',
    color: selected ? '#c4b5fd' : '#94a3b8',
    cursor: 'pointer',
    fontSize: '12px',
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <header style={styles.header}>
          <div style={styles.brand}>✓ TaskFlow</div>
          <div style={styles.date}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </header>

        <section style={styles.hero}>
          <p style={styles.eyebrow}>YOUR PERSONAL WORKSPACE</p>
          <h1 style={styles.heading}>
            Stay focused.
            <br />
            <span style={{ color: '#a78bfa' }}>Get things done.</span>
          </h1>
          <p style={styles.subtitle}>
            Organize your day, track your progress, and make every task count.
          </p>
        </section>

        <section style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Tasks</div>
            <div style={styles.statNumber}>{tasks.length}</div>
            <div style={styles.statLabel}>Tasks in your workspace</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Pending Tasks</div>
            <div style={{ ...styles.statNumber, color: '#fbbf24' }}>
              {pending}
            </div>
            <div style={styles.statLabel}>Waiting to be completed</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>Completed Tasks</div>
            <div style={{ ...styles.statNumber, color: '#34d399' }}>
              {completed}
            </div>
            <div style={styles.statLabel}>Tasks you've finished</div>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.eyebrow}>TASK MANAGEMENT</div>
          <h2 style={styles.panelTitle}>Your Tasks</h2>
          <p style={styles.subtitle}>
            Keep track of everything you need to do.
          </p>

          <form onSubmit={addTask} style={styles.form}>
            <input
              style={styles.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done today?"
            />

            <button
              type="submit"
              style={{
                ...styles.addButton,
                opacity: adding || !text.trim() ? 0.6 : 1,
              }}
              disabled={adding || !text.trim()}
            >
              {adding ? 'Adding...' : '+ Add Task'}
            </button>
          </form>

          {error && (
            <div style={styles.error}>
              {error}
              <button
                onClick={fetchTasks}
                style={{
                  marginLeft: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div style={styles.filters}>
            {['all', 'active', 'completed'].map((item) => (
              <button
                key={item}
                style={buttonStyle(filter === item)}
                onClick={() => setFilter(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #29334d' }}>
            {loading ? (
              <div style={styles.empty}>Loading your tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: '35px', marginBottom: '10px' }}>
                  ✦
                </div>
                <h3 style={{ color: '#e2e8f0' }}>
                  {tasks.length === 0
                    ? 'Your workspace is clear!'
                    : 'No tasks found'}
                </h3>
                <p>
                  {tasks.length === 0
                    ? 'Add your first task and start making progress.'
                    : 'Try selecting another filter.'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task._id} style={styles.task}>
                  <button
                    onClick={() => toggleTask(task._id)}
                    aria-label="Toggle task completion"
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: '1px solid #64748b',
                      background: task.completed ? '#8b5cf6' : 'transparent',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    {task.completed ? '✓' : ''}
                  </button>

                  <span
                    style={{
                      ...styles.taskText,
                      color: task.completed ? '#64748b' : '#e2e8f0',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.text}
                  </span>

                  <span
                    style={{
                      color: task.completed ? '#34d399' : '#fbbf24',
                      fontSize: '11px',
                    }}
                  >
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>

                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteTask(task._id)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <footer
          style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '11px',
            padding: '25px 0',
          }}
        >
          TaskFlow · MERN Stack · Dockerized Deployment
        </footer>

      </div>
    </div>
  );
}

export default App;
