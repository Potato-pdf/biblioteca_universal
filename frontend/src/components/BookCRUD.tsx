import React, { useState, useEffect } from 'react';
import { apiService, Book } from '../services/api.service';
import { BookViewModel } from '../viewmodels/book.viewmodel';
import { ArrowLeft, Edit, Trash2, Plus, Upload } from 'lucide-react';

interface BookCRUDProps {
    onBack: () => void;
}

export const BookCRUD: React.FC<BookCRUDProps> = ({ onBack }) => {
    const [books, setBooks] = useState<BookViewModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await apiService.getAllBooks();
            if (response.success) {
                setBooks(response.data);
            }
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'portadaBase64' | 'pdfBase64') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Keep the full data URL with prefix
                setCurrentBook(prev => ({ ...prev, [field]: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentBook.id) {
                await apiService.updateBook(currentBook.id, currentBook);
            } else {
                await apiService.createBook(currentBook as Book);
            }
            setIsModalOpen(false);
            loadBooks();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este libro?')) {
            try {
                await apiService.deleteBook(id);
                loadBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const openModal = (book?: BookViewModel) => {
        if (book) {
            // Map ViewModel to Book for editing
            setCurrentBook({
                id: book.idLibro,
                titulo: book.titulo,
                genero: book.descripcion,
                portadaBase64: book.portadaUrl,
                pdfBase64: book.pdfUrl,
                authorName: book.autor,
                publishDate: book.fechaPublicacion
            } as any);
            setIsEditing(true);
        } else {
            setCurrentBook({});
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="flex items-center text-gray-600 mb-6 hover:text-gray-800">
                    <ArrowLeft className="mr-2" size={20} /> Volver
                </button>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Gestión de Libros</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700"
                    >
                        <Plus className="mr-2" size={20} /> Nuevo Libro
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {book.portadaUrl && (
                                            <img src={book.portadaUrl} alt="Portada" className="h-12 w-8 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.descripcion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(book)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => book.idLibro && handleDelete(book.idLibro)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Libro' : 'Nuevo Libro'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Título</label>
                                <input
                                    type="text"
                                    value={currentBook.titulo || ''}
                                    onChange={(e) => setCurrentBook({ ...currentBook, titulo: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Autor</label>
                                <input
                                    type="text"
                                    value={currentBook.authorName || ''}
                                    onChange={(e) => setCurrentBook({ ...currentBook, authorName: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Género</label>
                                <input
                                    type="text"
                                    value={currentBook.genero || ''}
                                    onChange={(e) => setCurrentBook({ ...currentBook, genero: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Portada (Imagen)</label>
                                <div className="flex items-center">
                                    <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center w-full justify-center">
                                        <Upload size={18} className="mr-2" />
                                        <span>Seleccionar Imagen</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'portadaBase64')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {currentBook.portadaBase64 ? (
                                    <img src={currentBook.portadaBase64} alt="Preview" className="mt-2 h-20 object-contain" />
                                ) : currentBook.portadaUrl ? (
                                    <img src={currentBook.portadaUrl} alt="Current" className="mt-2 h-20 object-contain" />
                                ) : null}
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2">PDF (Documento)</label>
                                <div className="flex items-center">
                                    <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex items-center w-full justify-center">
                                        <Upload size={18} className="mr-2" />
                                        <span>Seleccionar PDF</span>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => handleFileChange(e, 'pdfBase64')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {currentBook.pdfBase64 && (
                                    <p className="text-xs text-green-600 mt-1">PDF cargado correctamente</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
