// src/auth/AuthContext.js
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../services/tokenService';

// Create and export the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: getUser(),
    token: getToken()
  });

  const navigate = useNavigate();

  // Login function
  const login = (user, token) => {
    setToken(token);
    setUser(user);
    setAuthState({ user, token });
    
    // Redirect based on role
    if (user.role === 'ROLE_ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    removeUser();
    setAuthState({ user: null, token: null });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      token: authState.token,
      role: authState.user?.role,  // Expose role if user exists
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
