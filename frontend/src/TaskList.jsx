import { api } from './api';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, onRefresh, onMsg }) {
  const handleDelete = async (id) => {
    const { ok, data } = await api('/tasks/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    onMsg(ok ? data.message || 'Deleted' : data.message || 'Delete failed', !ok);
    if (ok) onRefresh();
  };

  const handleUpdate = async (id, title, description, status) => {
    const { ok, data } = await api('/tasks/update', {
      method: 'PUT',
      body: JSON.stringify({ id, title, description, status }),
    });
    onMsg(ok ? data.message || 'Updated' : data.message || 'Update failed', !ok);
    if (ok) onRefresh();
  };

  if (tasks.length === 0) {
    return <p>No tasks. Add one above.</p>;
  }

  return (
    <div>
      {tasks.map((t) => (
        <TaskCard
          key={t._id}
          task={t}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
