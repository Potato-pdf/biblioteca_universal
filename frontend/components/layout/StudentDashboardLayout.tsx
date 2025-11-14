import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import BookSearchPage from '../../pages/BookSearchPage';

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const StudentDashboardLayout: React.FC = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                         <h1 className="text-2xl font-extrabold text-primary-800">
                           Biblioteca Gustambo
                         </h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-9 w-9 bg-primary-500 rounded-full flex items-center justify-center">
                                    <UserIcon />
                                </div>
                                <span className="text-gray-700 font-semibold hidden sm:inline">
                                    {user?.name.split(' ')[0]}
                                </span>
                            </div>
                             <button onClick={logout} title="Cerrar Sesión" className="flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                                <LogoutIcon />
                             </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="pb-8">
                <BookSearchPage />
            </main>
        </div>
    );
}

export default StudentDashboardLayout;