import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { BookViewModel } from '../viewmodels/book.viewmodel';
import { BookOpen } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface StudentMenuProps {
    onNavigate: (view: 'search') => void;
    onLogout: () => void;
}

export const StudentMenu: React.FC<StudentMenuProps> = ({ onNavigate, onLogout }) => {
    const [books, setBooks] = useState<BookViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookViewModel | null>(null);

    // Cargar todos los libros al iniciar
    useEffect(() => {
        loadAllBooks();
    }, []);

    const loadAllBooks = async () => {
        setLoading(true);
        try {
            const response = await apiService.searchBooks("");
            if (response.success) {
                setBooks(response.data);
            }
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    // Si se selecciona un libro, mostrar el visor de PDF
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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Catálogo de Libros</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => onNavigate('search')}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                        >
                            Buscador
                        </button>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center text-gray-600 py-10">
                        Cargando libros...
                    </div>
                )}

                {/* Grid de libros - MISMO DISEÑO que BookSearch */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book, index) => (
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

                {/* Mensaje si no hay libros */}
                {!loading && books.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        No hay libros disponibles en este momento
                    </div>
                )}
            </div>
        </div>
    );
};
