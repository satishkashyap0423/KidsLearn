import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  // Initial state for user
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage
    const savedUser = localStorage.getItem('kidlearn_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('kidlearn_user', JSON.stringify(user));
    }
  }, [user]);

  // Function to update user data
  const updateUser = (userData) => {
    setUser(currentUser => ({
      ...currentUser,
      ...userData
    }));
  };

  // Function to clear user data (logout)
  const clearUser = () => {
    localStorage.removeItem('kidlearn_user');
    setUser(null);
  };

  // Value to be provided by the context
  const value = {
    user,
    setUser,
    updateUser,
    clearUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
