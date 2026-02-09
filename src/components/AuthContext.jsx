import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on initial render
    axios.get("http://localhost/lodifhinew-main/api/checkSession.php", {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost/lodifhinew-main/api/login.php",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        setUser(response.data.user); // update context state
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost/lodifhinew-main/api/logout.php",
        {},
        { withCredentials: true }
      );
      setUser(null); // update context state immediately
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

