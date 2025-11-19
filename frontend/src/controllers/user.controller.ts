// User Controller - Coordinates user management logic
// NO VIEW CODE - only state management and API coordination
import { useState, useEffect } from "react";
import { apiService } from "../services/api.service";
import type {
  UserViewModel,
  CreateUserDTO,
  UpdateUserDTO,
} from "../viewmodels/user.viewmodel";

export const useUserController = () => {
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar usuarios";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await apiService.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear usuario";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: UpdateUserDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await apiService.updateUser(id, userData);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser : user))
      );
      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar usuario";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar usuario";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export const useUserDetailController = (userId: string) => {
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getUserById(userId);
      setUser(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar usuario";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    loadUser,
  };
};
