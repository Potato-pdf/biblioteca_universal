// Auth Controller - Coordinates authentication logic
// NO VIEW CODE - only state management and API coordination
import { useState } from "react";
import { apiService } from "../services/api.service";
import type { LoginCredentials } from "../viewmodels/user.viewmodel";

export const useAuthController = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(credentials);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiService.logout();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleLogin,
    handleLogout,
  };
};
