import { useState } from 'react';
import { api } from './api';

export default function Auth({ onLogin }) {
  const [authMsg, setAuthMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const showMsg = (text, err) => {
    setAuthMsg(text);
    setIsError(!!err);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
    };
    const { ok, data } = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (ok) {
      onLogin(data);
    } else {
      showMsg(data.message || 'Register failed', true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      username: form.username.value.trim(),
      password: form.password.value,
    };
    const { ok, data } = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (ok) {
      onLogin(data);
    } else {
      showMsg(data.message || 'Login failed', true);
    }
  };

  return (
    <div>
      {authMsg && (
        <div className={`msg ${isError ? 'err' : 'ok'}`}>{authMsg}</div>
      )}
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8)"
          required
          minLength={8}
        />
        <button type="submit">Register</button>
      </form>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
