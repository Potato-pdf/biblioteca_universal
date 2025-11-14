import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types';

interface LoginPageProps {
    users: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ users }) => {
    const { login } = useContext(AuthContext);
    const [selectedEmail, setSelectedEmail] = useState<string>(users[0]?.email || '');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEmail) {
            login(selectedEmail);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Columna de la imagen */}
            <div className="hidden lg:block bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/librarylogin/1200/1800')" }}>
                <div className="w-full h-full bg-slate-900/50 flex items-end p-12">
                    <div className="text-white">
                        <h2 className="text-4xl font-bold leading-tight">Bienvenido al portal académico de Gustambo University.</h2>
                        <p className="mt-4 text-lg text-slate-300 max-w-lg">Acceda a un vasto ecosistema de recursos académicos para potenciar su investigación y aprendizaje.</p>
                    </div>
                </div>
            </div>

            {/* Columna del formulario */}
            <div className="bg-slate-50 flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-primary-800">
                           Biblioteca Gustambo
                        </h1>
                        <p className="mt-2 text-slate-500">Inicie sesión para explorar los recursos.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Perfil de Usuario
                            </label>
                            <div className="mt-1">
                                <select
                                    id="email"
                                    name="email"
                                    value={selectedEmail}
                                    onChange={(e) => setSelectedEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    {users.map(user => (
                                        <option key={user.id} value={user.email}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;