import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const AuthContext = createContext(); // Export AuthContext

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state

  // Check if user is authenticated on initial render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://wildlens-tours-backend-q5lv.onrender.com/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(response.data)
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null); // Clear user on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('https://wildlens-tours-backend-q5lv.onrender.com/api/auth/signin', credentials);
      sessionStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://wildlens-tours-backend-q5lv.onrender.com/api/auth/logout');
      sessionStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
