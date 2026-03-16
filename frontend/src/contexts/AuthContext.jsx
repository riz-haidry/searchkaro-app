/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { login as loginApi } from "../api";

const AuthContext = createContext();

// --- COOKIE HELPERS ---
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = getCookie("token");
        // LocalStorage se saved user data 
        const savedUser = localStorage.getItem("user_data");
        
        if (storedToken) {
          setToken(storedToken);
          // Agar localStorage mein data hai toh  set , warna default Rizwan set 
          setUser(savedUser ? JSON.parse(savedUser) : { name: "Rizwan", role: "Java Developer", loggedIn: true });
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginApi(credentials);
      const t = res.data.token;
      
      // Backend se user data , agar na mile toh default details set 
      const u = res.data.user || { name: "Rizwan", role: "Java Developer", loggedIn: true };

      if (!t) throw new Error("No token received");

      setCookie("token", t, 7);
      // User data ko save taaki refresh par data na jaye
      localStorage.setItem("user_data", JSON.stringify(u));
      
      setToken(t);
      setUser(u);

      setLoading(false);
      window.location.href = "/dashboard";

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Login failed",
      };
    }
  };

  const logout = useCallback(() => {
    deleteCookie("token");
    // Logout par localStorage bhi clear 
    localStorage.removeItem("user_data");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};