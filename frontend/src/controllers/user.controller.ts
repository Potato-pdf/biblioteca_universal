import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { UserViewModel } from '../viewmodels/user.viewmodel';

export const useUserController = () => {
    const [users, setUsers] = useState<UserViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.getAllUsers();
            setUsers(response.data);
        } catch (err: any) {
            const errorMsg = err.message || 'Error al cargar usuarios';
            setError(errorMsg);
            console.error('Error cargando usuarios:', err);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: { nombre: string; email: string; password: string; rol: string }): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.createUser(userData);
            if (response.success) {
                if (response.data) {
                    setUsers(prev => [...prev, response.data]);
                } else {
                    await loadUsers();
                }
                return true;
            } else {
                throw new Error(response.error || 'Error al crear usuario');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Error al crear usuario';
            setError(errorMsg);
            console.error('Error creando usuario:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, userData: Partial<{ nombre: string; email: string; password?: string; rol: string }>): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.updateUser(id, userData);
            if (response.success) {
                if (response.data) {
                    setUsers(prev => prev.map(u => u.id === id ? response.data : u));
                } else {
                    await loadUsers();
                }
                return true;
            } else {
                throw new Error(response.error || 'Error al actualizar usuario');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Error al actualizar usuario';
            setError(errorMsg);
            console.error('Error actualizando usuario:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.deleteUser(id);
            if (response.success) {
                setUsers(prev => prev.filter(u => u.id !== id));
                return true;
            } else {
                throw new Error(response.error || 'Error al eliminar usuario');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Error al eliminar usuario';
            setError(errorMsg);
            console.error('Error eliminando usuario:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loadUsers,
        createUser,
        updateUser,
        deleteUser,
        loading,
        error,
    };
};
