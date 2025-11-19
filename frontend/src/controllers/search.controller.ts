// Search Controller - Coordinates search logic across multiple sources
// NO VIEW CODE - only state management and API coordination
import { useState } from "react";
import { apiService } from "../services/api.service";
import type { BookViewModel } from "../viewmodels/book.viewmodel";

export const useSearchController = () => {
  const [results, setResults] = useState<BookViewModel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = async (titulo: string) => {
    if (!titulo.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiService.searchBooks(titulo);
      setResults(response.libros);
      setTotal(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al buscar libros";
      setError(errorMessage);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setTotal(0);
    setError(null);
  };

  return {
    results,
    total,
    loading,
    error,
    searchBooks,
    clearSearch,
  };
};

export const useBookViewController = (id: string, universidad?: string) => {
  const [book, setBook] = useState<BookViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.viewBook(id, universidad);
      setBook(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar el libro";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    book,
    loading,
    error,
    loadBook,
  };
};
