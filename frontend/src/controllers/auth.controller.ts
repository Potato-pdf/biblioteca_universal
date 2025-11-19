import { useState } from 'react';
import { apiService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';

export const useAuthController = () => {
    const { login: setAuthUser, logout: clearAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.login({ email, password });
            setAuthUser(response.user);
            return { success: true, user: response.user };
        } catch (err: any) {
            const errorMsg = err.message || 'Error al iniciar sesión';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuthUser();
    };

    return {
        login,
        logout,
        loading,
        error,
    };
};
