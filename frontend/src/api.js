// Backend base URL: use .env VITE_API_BASE or fallback for dev
const raw = import.meta.env.VITE_API_BASE || '';
const API_BASE = raw.startsWith('http')
  ? raw.replace(/\/$/, '')
  : raw || 'http://localhost:5000/api/v1';

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export function setAuth(data) {
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function api(path, options = {}) {
  const url = path.startsWith('http') ? path : API_BASE + path;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: {
        message:
          err.message === 'Failed to fetch'
            ? 'Backend unreachable. Start the server: cd backend && npm start'
            : err.message,
      },
    };
  }
}
