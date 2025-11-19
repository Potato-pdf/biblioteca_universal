// Auth Context - Manages authentication state across the app
import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserViewModel } from "../viewmodels/user.viewmodel";
import { apiService } from "../services/api.service";

interface AuthContextType {
  user: UserViewModel | null;
  isAuthenticated: boolean;
  isBibliotecario: boolean;
  isAlumno: boolean;
  setUser: (user: UserViewModel | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserViewModel | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = () => {
    apiService.logout().catch(console.error);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isBibliotecario: user?.rol === "bibliotecario",
    isAlumno: user?.rol === "alumno",
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
