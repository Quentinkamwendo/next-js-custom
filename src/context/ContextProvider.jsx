'use client'
import { createContext, useState } from "react";

export const StateContext = createContext({});

// eslint-disable-next-line react/prop-types
export function ContextProvider({ children }) {
  const [token, setToken] = useState(typeof window !== 'undefined' ? sessionStorage.getItem("token") : null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const setAuthData = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);

    // store token in sessionStorage to persist the session
    sessionStorage.setItem("token", newToken);
  };

  const clearAuthData = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };

  return (
    <StateContext.Provider
      value={{
        token,
        loading,
        setLoading,
        setAuthData,
        clearAuthData,
        user
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

