import React, { useState, useMemo } from 'react';
import { mockUsers } from '../data/mockData';
import { User, UserRole, DataSource } from '../types';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers.filter(u => u.source === DataSource.Internal));
    
    const internalUsers = useMemo(() => users, [users]);

    return (
        <div className="container mx-auto">
             <header className="mb-6 pb-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios Internos</h1>
                    <p className="text-gray-500 mt-1">Añade, edita o elimina usuarios del sistema.</p>
                </div>
                <button className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-primary-700 transition-colors font-semibold">
                    <PlusIcon/>
                    <span>Añadir Usuario</span>
                </button>
            </header>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rol</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {internalUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name.split(' (')[0]}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === UserRole.Librarian 
                                        ? 'bg-secondary/10 text-secondary' 
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role === UserRole.Librarian ? 'Bibliotecario' : 'Alumno'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                     <button className="text-primary-600 hover:text-primary-900 p-2 rounded-full hover:bg-primary-100 transition-colors"><EditIcon/></button>
                                     <button className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"><TrashIcon/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <footer className="text-right mt-4 text-sm text-gray-500">
                Mostrando {internalUsers.length} de {internalUsers.length} usuarios.
            </footer>
        </div>
    );
};

export default UserManagementPage;