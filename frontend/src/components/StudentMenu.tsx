import React from 'react';

interface StudentMenuProps {
    onNavigate: (view: 'search') => void;
    onLogout: () => void;
}

export const StudentMenu: React.FC<StudentMenuProps> = ({ onNavigate, onLogout }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Panel de Alumno</h1>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div
                        onClick={() => onNavigate('search')}
                        className="bg-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                        <h2 className="text-2xl font-bold text-purple-600 mb-4">Buscador Universal</h2>
                        <p className="text-gray-600">Buscar libros en la biblioteca local y universidades asociadas.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
