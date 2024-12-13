import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(); // Create the context

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(); // Track authenticated user
  const [isLoading, setIsLoading] = useState(true); // To show loading spinner while checking authentication

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Assuming token means user is authenticated
          setUser({ token });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false); // Finish loading check
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array to run only once

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      setUser({ token }); // Store token or user data
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null); // Remove user data
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
