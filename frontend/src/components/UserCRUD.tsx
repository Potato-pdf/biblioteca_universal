import React, { useState, useEffect } from 'react';
import { apiService, User } from '../services/api.service';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';

interface UserCRUDProps {
    onBack: () => void;
}

export const UserCRUD: React.FC<UserCRUDProps> = ({ onBack }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await apiService.getUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentUser.id) {
                await apiService.updateUser(currentUser.id, currentUser);
            } else {
                await apiService.createUser(currentUser as User);
            }
            setIsModalOpen(false);
            loadUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await apiService.deleteUser(id);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const openModal = (user?: User) => {
        if (user) {
            setCurrentUser(user);
            setIsEditing(true);
        } else {
            setCurrentUser({ rol: 'alumno' });
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
                    <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
                    >
                        <Plus className="mr-2" size={20} /> Nuevo Usuario
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'bibliotecario' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => user.id && handleDelete(user.id)} className="text-red-600 hover:text-red-900">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={currentUser.name || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={currentUser.email || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            {!isEditing && (
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Contraseña</label>
                                    <input
                                        type="password"
                                        value={currentUser.password || ''}
                                        onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-6">
                                <label className="block text-sm font-bold mb-2">Rol</label>
                                <select
                                    value={currentUser.rol || 'alumno'}
                                    onChange={(e) => setCurrentUser({ ...currentUser, rol: e.target.value as any })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="alumno">Alumno</option>
                                    <option value="bibliotecario">Bibliotecario</option>
                                </select>
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
