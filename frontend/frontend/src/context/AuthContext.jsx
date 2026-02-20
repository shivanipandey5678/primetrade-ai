import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // page load pe localStorage se user/token lo
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    setFavorites(res.user.favorites || []);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register(name, email, password);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    setFavorites(res.user.favorites || []);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  const updateFavorites = (newList) => setFavorites(newList || []);

  const value = { user, token, favorites, login, register, logout, updateFavorites };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth sirf AuthProvider ke andar use karo");
  return ctx;
}
