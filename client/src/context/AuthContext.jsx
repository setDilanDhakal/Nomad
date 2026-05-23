import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem("nomadUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("nomadUser");
    return null;
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const setAuthSession = ({ user: nextUser, token }) => {
    setUser(nextUser || null);

    if (typeof window === "undefined") {
      return;
    }

    if (token) {
      localStorage.setItem("nomadToken", token);
    }

    if (nextUser) {
      localStorage.setItem("nomadUser", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("nomadUser");
    }
  };

  const clearAuthSession = () => {
    setUser(null);

    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem("nomadToken");
    localStorage.removeItem("nomadUser");
  };

  const value = useMemo(
    () => ({
      user,
      setAuthSession,
      clearAuthSession,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
