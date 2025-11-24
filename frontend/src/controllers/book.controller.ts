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

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const formDataToJson = async (formData: FormData) => {
        const data: any = {};
        data.name = formData.get('titulo');
        data.authorName = formData.get('autor');
        data.description = formData.get('descripcion');
        data.publishDate = formData.get('fechaPublicacion');

        const pdfFile = formData.get('pdf') as File;
        if (pdfFile && pdfFile.size > 0) {
            data.pdfUrl = await fileToBase64(pdfFile);
        }

        const coverFile = formData.get('portada') as File;
        if (coverFile && coverFile.size > 0) {
            data.imageUrl = await fileToBase64(coverFile);
        }

        return data;
    };

    const createBook = async (formData: FormData): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const bookData = await formDataToJson(formData);
            const response = await apiService.createBook(bookData);
            if (response.success) {
                // Reload books to get the new one with ID
                await loadBooks();
                return true;
            }
            return false;
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
            const bookData = await formDataToJson(formData);
            const response = await apiService.updateBook(id, bookData);
            if (response.success) {
                await loadBooks();
                return true;
            }
            return false;
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
