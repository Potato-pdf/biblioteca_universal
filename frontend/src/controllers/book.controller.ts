import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { BookViewModel } from '../viewmodels/book.viewmodel';

export const useBookController = () => {
    const [books, setBooks] = useState<BookViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadBooks = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getAllBooks();
            setBooks(response.data);
        } catch (err: any) {
            const errorMsg = err.message || 'Error al cargar libros';
            setError(errorMsg);
            console.error('Error cargando libros:', err);
        } finally {
            setLoading(false);
        }
    };

    const createBook = async (formData: FormData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.createBook(formData);
            setBooks(prev => [...prev, response.data]);
            return true;
        } catch (err: any) {
            const errorMsg = err.message || 'Error al crear libro';
            setError(errorMsg);
            console.error('Error creando libro:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateBook = async (id: string, formData: FormData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.updateBook(id, formData);
            setBooks(prev => prev.map(b => b.idLibro === id ? response.data : b));
            return true;
        } catch (err: any) {
            const errorMsg = err.message || 'Error al actualizar libro';
            setError(errorMsg);
            console.error('Error actualizando libro:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            await apiService.deleteBook(id);
            setBooks(prev => prev.filter(b => b.idLibro !== id));
            return true;
        } catch (err: any) {
            const errorMsg = err.message || 'Error al eliminar libro';
            setError(errorMsg);
            console.error('Error eliminando libro:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        books,
        loadBooks,
        createBook,
        updateBook,
        deleteBook,
        loading,
        error,
    };
};
