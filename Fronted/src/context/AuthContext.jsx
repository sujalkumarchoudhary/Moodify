import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore user from localStorage so state survives page refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("moodify_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("moodify_user", JSON.stringify(userData));
  };

  const login = async (data) => {
    const res = await api.post("/api/auth/login", data);
    saveUser(res.data.user);
  };

  const register = async (data) => {
    const res = await api.post("/api/auth/register", data);
    // Backend sets JWT cookie on register too — log them in right away
    saveUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    localStorage.removeItem("moodify_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);