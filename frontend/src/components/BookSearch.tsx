import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { BookViewModel } from '../viewmodels/book.viewmodel';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface BookSearchProps {
    onBack: () => void;
}

export const BookSearch: React.FC<BookSearchProps> = ({ onBack }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<BookViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookViewModel | null>(null);

    // 🆕 CARGAR TODOS LOS LIBROS AL INICIO
    useEffect(() => {
        loadAllBooks();
    }, []);

    const loadAllBooks = async () => {
        setLoading(true);
        try {
            // Llamar con query vacío para obtener TODOS los libros
            const response = await apiService.searchBooks("");
            if (response.success) {
                setResults(response.data);
                console.log(`📚 Libros cargados: ${response.data.length}`);
            }
        } catch (error) {
            console.error('Error loading initial books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            // Si la búsqueda está vacía, recargar todos
            loadAllBooks();
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.searchBooks(query);
            if (response.success) {
                setResults(response.data);
            }
        } catch (error) {
            console.error('Error searching books:', error);
        } finally {
            setLoading(false);
        }
    };

    if (selectedBook) {
        return (
            <PDFViewer
                pdfUrl={selectedBook.pdfUrl}
                title={selectedBook.titulo}
                onBack={() => setSelectedBook(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="flex items-center text-gray-600 mb-6 hover:text-gray-800">
                    <ArrowLeft className="mr-2" size={20} /> Volver
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Buscador Universal</h1>

                <div className="max-w-2xl mx-auto mb-10">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por título, autor o género..."
                            className="w-full p-4 pl-12 rounded-full shadow-md border-none focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((book, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {book.portadaUrl ? (
                                    <img
                                        src={book.portadaUrl}
                                        alt={book.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <BookOpen size={48} />
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 m-2 rounded">
                                    {book.universidad || 'Local'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{book.titulo}</h3>
                                <p className="text-gray-600 text-sm mb-4">{book.descripcion}</p>
                                <button
                                    onClick={() => setSelectedBook(book)}
                                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
                                >
                                    <BookOpen size={18} className="mr-2" /> Leer Libro
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && results.length === 0 && query && (
                    <div className="text-center text-gray-500 mt-10">
                        No se encontraron resultados para "{query}"
                    </div>
                )}
            </div>
        </div>
    );
};
