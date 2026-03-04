import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Stores logged-in user
  const [loading, setLoading] = useState(true); // True while checking session

  const API_BASE = "http://localhost/lodifhinew-main/api"; // change if needed

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_BASE}/checkSession.php`, {
          withCredentials: true,
        });

        if (res.data.loggedIn) setUser(res.data.user);
        else setUser(null);
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE}/login.php`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.loggedIn) {
        setUser(res.data.user);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout.php`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
