import { useState } from 'react';
import { api } from './api';

export default function TaskForm({ userId, onSuccess, onError }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: title.trim(),
      description: description.trim(),
      status,
      user: userId,
    };
    const { ok, data } = await api('/tasks/add', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (ok) {
      setTitle('');
      setDescription('');
      setStatus('pending');
      onSuccess(data.message);
    } else {
      onError(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">pending</option>
        <option value="in-progress">in-progress</option>
        <option value="completed">completed</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}
