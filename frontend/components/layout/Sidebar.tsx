import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Page } from './LibrarianDashboardLayout';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useContext(AuthContext);

  const navItemClasses = (page: Page) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 font-medium ${
      currentPage === page
        ? 'bg-primary-700 text-white shadow-sm'
        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-extrabold text-primary-800">Biblioteca Gustambo</h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenido, <span className="font-semibold">{user?.name.split(' ')[0]}</span></p>
        </div>
        <nav className="p-4 space-y-1">
          <div onClick={() => setCurrentPage('search')} className={navItemClasses('search')}>
            <SearchIcon />
            <span>Buscar Libros</span>
          </div>
          {user?.role === UserRole.Librarian && (
            <>
              <div onClick={() => setCurrentPage('books')} className={navItemClasses('books')}>
                <BookOpenIcon />
                <span>Gestión de Libros</span>
              </div>
              <div onClick={() => setCurrentPage('users')} className={navItemClasses('users')}>
                <UsersIcon />
                <span>Gestión de Usuarios</span>
              </div>
            </>
          )}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button onClick={logout} className="w-full flex items-center justify-center space-x-3 px-4 py-2.5 rounded-md font-medium text-red-600 hover:bg-red-50 transition-colors duration-200">
          <LogoutIcon />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;