import { createContext, useContext, useState } from 'react';
import { users } from '../utils/auth';
import { toast } from 'react-toastify';
import { LocalClient } from '../Api/API_Client';
import { API } from '../Api/Endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await LocalClient.post(API.login, { email, password });
  
      if (response.status === 200) {
        toast.success("Login Success");
  
        const userInfo = { ...response.data.user }; // Get user data from API response
        delete userInfo.password; // Remove password for security
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        return true;
      }
    } catch (error) {
      console.log(" this is the error " ,error);
      
      // 🔥 Check if the error is due to no internet connection
      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.");
        return false;
      }
  
      // 🔥 Handle server errors
      if (error.response) {
        // Server responded with a status code (e.g., 401, 500)
        toast.error(error.response.data.message || "Login failed.");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Server is unreachable. Please try again later.");
      } else {
        // Unknown error
        toast.error("An unexpected error occurred.");
      }
    }
  
    return false;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};