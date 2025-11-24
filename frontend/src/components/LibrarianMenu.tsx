import React from 'react';

interface LibrarianMenuProps {
    onNavigate: (view: 'users' | 'books') => void;
    onLogout: () => void;
}

export const LibrarianMenu: React.FC<LibrarianMenuProps> = ({ onNavigate, onLogout }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Panel de Bibliotecario</h1>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => onNavigate('users')}
                        className="bg-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Gestión de Usuarios</h2>
                        <p className="text-gray-600">Registrar, editar y eliminar usuarios del sistema.</p>
                    </div>

                    <div
                        onClick={() => onNavigate('books')}
                        className="bg-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Gestión de Libros</h2>
                        <p className="text-gray-600">Administrar el catálogo de libros internos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
