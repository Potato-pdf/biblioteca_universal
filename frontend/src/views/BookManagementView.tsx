// Book Management View (Bibliotecario only) - NO LOGIC, only UI
import React, { useEffect, useState } from "react";
import { useBookController } from "../controllers/book.controller";
import type { CreateBookDTO, UpdateBookDTO } from "../viewmodels/book.viewmodel";
import { ImageUpload } from "./ImageUpload";
import { PdfUpload } from "./PdfUpload";

export const BookManagementView: React.FC = () => {
  const { books, loading, error, loadBooks, createBook, updateBook, deleteBook } =
    useBookController();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const handleCreate = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este libro?")) {
      await deleteBook(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleFormSubmit = async (data: CreateBookDTO | UpdateBookDTO) => {
    try {
      if (editingId) {
        await updateBook(editingId, data as UpdateBookDTO);
      } else {
        await createBook(data as CreateBookDTO);
      }
      handleFormClose();
    } catch (err) {
      // Error handled by controller
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Libros</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Agregar Libro
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-gray-600">Cargando libros...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
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
              <p className="text-xs text-gray-500 mb-3">
                {book.añoPublicacion}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(book.id)}
                  className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BookFormModal
          bookId={editingId}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

const BookFormModal: React.FC<{
  bookId: string | null;
  onClose: () => void;
  onSubmit: (data: CreateBookDTO | UpdateBookDTO) => void;
}> = ({ bookId, onClose, onSubmit }) => {
  const { books } = useBookController();
  const existingBook = bookId ? books.find((b) => b.id === bookId) : null;

  const [formData, setFormData] = useState<CreateBookDTO>({
    nombre: existingBook?.nombre || "",
    autor: existingBook?.autor || "",
    descripcion: existingBook?.descripcion || "",
    imageUrl: existingBook?.imageUrl || "",
    pdfUrl: existingBook?.pdfUrl || "",
    añoPublicacion: existingBook?.añoPublicacion || new Date().getFullYear(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
          <h2 className="text-2xl font-bold mb-4">
            {bookId ? "Editar Libro" : "Agregar Libro"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor *
              </label>
              <input
                type="text"
                value={formData.autor}
                onChange={(e) =>
                  setFormData({ ...formData, autor: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de Publicación *
              </label>
              <input
                type="number"
                value={formData.añoPublicacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    añoPublicacion: parseInt(e.target.value),
                  })
                }
                required
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                required
                maxLength={1000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/1000 caracteres
              </p>
            </div>

            <ImageUpload
              currentImageUrl={formData.imageUrl}
              onUploadComplete={(url) =>
                setFormData({ ...formData, imageUrl: url })
              }
            />

            <PdfUpload
              currentPdfUrl={formData.pdfUrl}
              onUploadComplete={(url) =>
                setFormData({ ...formData, pdfUrl: url })
              }
            />

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!formData.imageUrl || !formData.pdfUrl}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {bookId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
