// Search View - NO LOGIC, only UI
import React, { useState } from "react";
import { useSearchController } from "../controllers/search.controller";
import type { BookViewModel } from "../viewmodels/book.viewmodel";

export const SearchView: React.FC = () => {
  const [query, setQuery] = useState("");
  const { results, total, loading, error, searchBooks } = useSearchController();
  const [selectedBook, setSelectedBook] = useState<BookViewModel | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Buscar Libros</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {total > 0 && (
        <p className="text-gray-600 mb-4">
          Se encontraron {total} resultados
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((book) => (
          <div
            key={`${book.id}-${book.universidad}`}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedBook(book)}
          >
            <img
              src={book.imageUrl}
              alt={book.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {book.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{book.autor}</p>
              <p className="text-xs text-gray-500">{book.universidad}</p>
              <p className="text-xs text-gray-400">{book.añoPublicacion}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

const BookDetailModal: React.FC<{
  book: BookViewModel;
  onClose: () => void;
}> = ({ book, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{book.nombre}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={book.imageUrl}
                alt={book.nombre}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Autor</p>
                <p className="font-medium">{book.autor}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Universidad</p>
                <p className="font-medium">{book.universidad}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Año de Publicación</p>
                <p className="font-medium">{book.añoPublicacion}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="text-gray-700">{book.descripcion}</p>
              </div>

              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Ver PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
