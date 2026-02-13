import { useState, useEffect } from 'react';
import { getToken, setAuth, clearAuth } from './api';
import Auth from './Auth';
import Dashboard from './Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const onLogin = (data) => {
    setAuth(data);
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={onLogout} />;
  }
  return <Auth onLogin={onLogin} />;
}
