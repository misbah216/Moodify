import React, { createContext, useState, useEffect } from "react";
import { getMe, login, register, logout } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGetMe = async () => {
    try {
      const data = await getMe();
      setUser(data.user || data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const data = await login(credentials);
      setUser(data.user || data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials) => {
    setLoading(true);
    try {
      const data = await register(credentials);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};