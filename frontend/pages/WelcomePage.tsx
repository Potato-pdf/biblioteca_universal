
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserRole } from '../types';

const UniversityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary-200" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
)

const WelcomePage: React.FC = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-white p-10 rounded-xl shadow-lg">
            <h1 className="text-5xl font-bold text-primary-700 mb-4">Bienvenido al Sistema de Biblioteca Gustambo</h1>
            <p className="text-xl text-gray-600 mb-2">Hola, <span className="font-semibold">{user?.name.split(' ')[0]}</span>.</p>
            <p className="max-w-2xl text-lg text-gray-500">
                {user?.role === UserRole.Librarian
                    ? "Utilice el menú de la izquierda para gestionar los recursos de la biblioteca o para buscar en el catálogo unificado."
                    : "Comience a explorar el catálogo para encontrar los recursos académicos para su investigación y estudio."}
            </p>
            <div className="mt-8">
                <UniversityIcon />
            </div>
        </div>
    );
};

export default WelcomePage;