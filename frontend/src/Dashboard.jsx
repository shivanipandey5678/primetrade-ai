import { useState, useEffect } from 'react';
import { getUser, api } from './api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function Dashboard({ onLogout }) {
  const user = getUser();
  const [dashMsg, setDashMsg] = useState('');
  const [msgError, setMsgError] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const showMsg = (text, isError) => {
    setDashMsg(text);
    setMsgError(!!isError);
  };

  const loadTasks = async () => {
    setLoading(true);
    const uid = user.id || '';
    const { ok, data } = await api('/tasks?user=' + encodeURIComponent(uid));
    if (ok) {
      setTasks(data.tasks || []);
    } else {
      showMsg(data.message || 'Failed to load tasks', true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <nav>
        <span>{user.username ? `Hi, ${user.username}` : 'Dashboard'}</span>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
      <h1>Dashboard - Tasks</h1>
      {dashMsg && (
        <div className={`msg ${msgError ? 'err' : 'ok'}`}>{dashMsg}</div>
      )}
      <TaskForm
        userId={user.id}
        onSuccess={() => {
          showMsg('Task created', false);
          loadTasks();
        }}
        onError={(msg) => showMsg(msg || 'Failed to add task', true)}
      />
      {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onRefresh={loadTasks} onMsg={showMsg} />}
    </div>
  );
}
