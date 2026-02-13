import { useState } from 'react';

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const handleSave = () => {
    onUpdate(task._id, title.trim(), description.trim(), status);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="card">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={2}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">pending</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">completed</option>
        </select>
        <div className="card-actions">
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <div className="card-actions">
        <button type="button" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button type="button" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
