// Book Controller - Coordinates book management logic
// NO VIEW CODE - only state management and API coordination
import { useState, useEffect } from "react";
import { apiService } from "../services/api.service";
import type {
  BookViewModel,
  CreateBookDTO,
  UpdateBookDTO,
} from "../viewmodels/book.viewmodel";

export const useBookController = () => {
  const [books, setBooks] = useState<BookViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAllBooks();
      setBooks(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar libros";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData: CreateBookDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newBook = await apiService.createBook(bookData);
      setBooks((prev) => [...prev, newBook]);
      return newBook;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear libro";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, bookData: UpdateBookDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBook = await apiService.updateBook(id, bookData);
      setBooks((prev) =>
        prev.map((book) => (book.id === id ? updatedBook : book))
      );
      return updatedBook;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar libro";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar libro";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    books,
    loading,
    error,
    loadBooks,
    createBook,
    updateBook,
    deleteBook,
  };
};

export const useBookDetailController = (bookId: string) => {
  const [book, setBook] = useState<BookViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getBookById(bookId);
      setBook(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar libro";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  return {
    book,
    loading,
    error,
    loadBook,
  };
};
