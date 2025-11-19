import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { BookViewModel } from '../viewmodels/book.viewmodel';

export const useSearchController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // El backend decide si busca en DB interna o externa
    // El frontend SOLO pide al backend y recibe ViewModels
    const searchBooks = async (query: string): Promise<BookViewModel[]> => {
        if (!query.trim()) return [];
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.searchBooks(query);
            return response.data;
        } catch (err: any) {
            const errorMsg = err.message || 'Error al buscar libros';
            setError(errorMsg);
            console.error('Error buscando libros:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {
        searchBooks,
        loading,
        error,
    };
};
