
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/tasks`;

const styles = {
  page: {
    width: '100%',
    minHeight: '100vh',
    background: '#0b1020',
    color: '#f1f5f9',
    fontFamily: 'Inter, Arial, sans-serif',
    padding: '32px 24px',
    boxSizing: 'border-box',
  },

  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '55px',
  },

  brand: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#60a5fa',
    letterSpacing: '-1px',
  },

  date: {
    color: '#94a3b8',
    fontSize: '14px',
  },

  hero: {
    marginBottom: '40px',
  },

  eyebrow: {
    color: '#60a5fa',
    fontSize: '12px',
    letterSpacing: '2px',
    fontWeight: '700',
    marginBottom: '14px',
  },

  heading: {
    fontSize: 'clamp(36px, 5vw, 58px)',
    fontWeight: '800',
    margin: '0 0 18px',
    lineHeight: '1.12',
    letterSpacing: '-2px',
  },

  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: 0,
  },

  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },

  statCard: {
    background: '#171e32',
    border: '1px solid #293650',
    borderRadius: '16px',
    padding: '25px',
    minWidth: 0,
  },

  statLabel: {
    color: '#a5b4cc',
    fontSize: '14px',
  },

  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '16px 0 7px',
  },

  panel: {
    background: '#171e32',
    border: '1px solid #293650',
    borderRadius: '18px',
    padding: '30px',
    width: '100%',
    boxSizing: 'border-box',
  },

  panelTitle: {
    fontSize: '25px',
    fontWeight: '700',
    margin: '0 0 8px',
  },

  form: {
    display: 'flex',
    gap: '12px',
    marginTop: '28px',
    marginBottom: '28px',
    width: '100%',
  },

  input: {
    flex: 1,
    minWidth: 0,
    padding: '15px 17px',
    borderRadius: '10px',
    border: '1px solid #35415d',
    background: '#0c1325',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
  },

  addButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 24px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },

  task: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '19px 5px',
    borderBottom: '1px solid #293650',
    width: '100%',
    boxSizing: 'border-box',
  },

  taskText: {
    flex: 1,
    minWidth: 0,
    fontSize: '14px',
    overflowWrap: 'anywhere',
  },

  deleteButton: {
    border: 'none',
    background: '#3b202d',
    color: '#fb7185',
    padding: '9px 13px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },

  empty: {
    textAlign: 'center',
    padding: '55px 15px',
    color: '#94a3b8',
  },

  error: {
    color: '#fda4af',
    background: '#3b202d',
    padding: '14px',
    borderRadius: '9px',
    fontSize: '13px',
    marginBottom: '18px',
  },
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  // GET tasks from backend
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

  // POST new task
  const addTask = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setAdding(true);

      await axios.post(API, {
        text: text.trim(),
      });

      setText('');
      await fetchTasks();
    } catch (err) {
      console.error('Add task error:', err);
      setError('Unable to add task. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  // DELETE task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      setTasks((current) =>
        current.filter((task) => task._id !== id)
      );

      setError('');
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Unable to delete task.');
    }
  };

  // Frontend-only completion toggle
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

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

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
    padding: '10px 17px',
    borderRadius: '8px',
    border: '1px solid',
    borderColor: selected ? '#2563eb' : '#35415d',
    background: selected ? '#172554' : 'transparent',
    color: selected ? '#bfdbfe' : '#94a3b8',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: selected ? '700' : '500',
  });

  return (
    <>
      {/* Override default Vite global styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          width: 100%;
          min-width: 320px;
          min-height: 100%;
          margin: 0;
          padding: 0;
        }

        body {
          display: block !important;
          width: 100%;
          min-width: 320px;
          min-height: 100vh;
          margin: 0 !important;
          padding: 0 !important;
          background: #0b1020 !important;
        }

        #root {
          display: block !important;
          width: 100% !important;
          max-width: none !important;
          min-height: 100vh;
          margin: 0 !important;
          padding: 0 !important;
          text-align: left !important;
        }

        button, input {
          font-family: inherit;
        }

        button {
          transition: opacity 0.2s ease, background 0.2s ease;
        }

        button:hover {
          opacity: 0.85;
        }

        input:focus {
  border-color: #60a5fa !important;
}

        @media (max-width: 700px) {
          .taskflow-page {
            padding: 24px 16px !important;
          }

          .taskflow-header {
            margin-bottom: 38px !important;
          }

          .taskflow-stats {
            grid-template-columns: 1fr !important;
          }

          .taskflow-panel {
            padding: 20px !important;
          }

          .taskflow-form {
            flex-direction: column;
          }

          .taskflow-form button {
            width: 100%;
          }

          .taskflow-task-status {
            display: none;
          }
        }

        @media (min-width: 701px) and (max-width: 950px) {
          .taskflow-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

      <main style={styles.page} className="taskflow-page">
        <div style={styles.container}>

          {/* Header */}
          <header
            style={styles.header}
            className="taskflow-header"
          >
            <div style={styles.brand}>
              <span style={{ marginRight: '9px' }}>✓</span>
              TaskFlow
            </div>

            <div style={styles.date}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </header>

          {/* Hero */}
          <section style={styles.hero}>
            <p style={styles.eyebrow}>
              YOUR PERSONAL WORKSPACE
            </p>

            <h1 style={styles.heading}>
              Stay focused.
              <br />
              <span style={{ color: '#60a5fa' }}>
                Get things done.
              </span>
            </h1>

            <p style={styles.subtitle}>
              Organize your day, track your progress, and make
              every task count.
            </p>
          </section>

          {/* Statistics */}
          <section
            style={styles.stats}
            className="taskflow-stats"
          >
            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Total Tasks
              </div>

              <div style={styles.statNumber}>
                {tasks.length}
              </div>

              <div style={styles.statLabel}>
                Tasks in your workspace
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Pending Tasks
              </div>

              <div
                style={{
                  ...styles.statNumber,
                  color: '#fbbf24',
                }}
              >
                {pending}
              </div>

              <div style={styles.statLabel}>
                Waiting to be completed
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Completed Tasks
              </div>

              <div
                style={{
                  ...styles.statNumber,
                  color: '#34d399',
                }}
              >
                {completed}
              </div>

              <div style={styles.statLabel}>
                Tasks you've finished
              </div>
            </div>
          </section>

          {/* Task Management */}
          <section
            style={styles.panel}
            className="taskflow-panel"
          >
            <p style={styles.eyebrow}>
              TASK MANAGEMENT
            </p>

            <h2 style={styles.panelTitle}>
              Your Tasks
            </h2>

            <p style={styles.subtitle}>
              Keep track of everything you need to do.
            </p>

            {/* Add Task Form */}
            <form
              onSubmit={addTask}
              style={styles.form}
              className="taskflow-form"
            >
              <input
                style={styles.input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What needs to be done today?"
                aria-label="New task"
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

            {/* Error */}
            {error && (
              <div style={styles.error}>
                {error}

                <button
                  onClick={fetchTasks}
                  style={{
                    marginLeft: '15px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '700',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Filters */}
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

              <span
                style={{
                  marginLeft: 'auto',
                  color: '#94a3b8',
                  fontSize: '12px',
                }}
              >
                {filteredTasks.length} of {tasks.length} tasks
              </span>
            </div>

            {/* Task List */}
            <div
              style={{
                borderTop: '1px solid #293650',
                width: '100%',
              }}
            >
              {loading ? (
                <div style={styles.empty}>
                  Loading your tasks...
                </div>
              ) : filteredTasks.length === 0 ? (
                <div style={styles.empty}>
                  <div
                    style={{
                      fontSize: '38px',
                      marginBottom: '12px',
                      color: '#60a5fa',
                    }}
                  >
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
                  <div
                    key={task._id}
                    style={styles.task}
                  >
                    {/* Completion */}
                    <button
                      onClick={() => toggleTask(task._id)}
                      aria-label="Toggle task completion"
                      style={{
                        width: '21px',
                        height: '21px',
                        flexShrink: 0,
                        borderRadius: '6px',
                        border: '1px solid #64748b',
                        background: task.completed
                          ? '#2563eb'
                          : 'transparent',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      {task.completed ? '✓' : ''}
                    </button>

                    {/* Task text */}
                    <span
                      style={{
                        ...styles.taskText,
                        color: task.completed
                          ? '#64748b'
                          : '#e2e8f0',
                        textDecoration: task.completed
                          ? 'line-through'
                          : 'none',
                      }}
                    >
                      {task.text}
                    </span>

                    {/* Status */}
                    <span
                      className="taskflow-task-status"
                      style={{
                        color: task.completed
                          ? '#34d399'
                          : '#fbbf24',
                        background: task.completed
                          ? '#163b32'
                          : '#3b3020',
                        padding: '7px 11px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>

                    {/* Delete */}
                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteTask(task._id)}
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Footer */}
          <footer
            style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: '12px',
              padding: '30px 0 15px',
            }}
          >
            <strong style={{ color: '#60a5fa' }}>
              TaskFlow
            </strong>
            {' '}· MERN Stack · Dockerized Deployment
          </footer>

        </div>
      </main>
    </>
  );
}

export default App;
