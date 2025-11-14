import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import BookSearchPage from '../../pages/BookSearchPage';
import BookManagementPage from '../../pages/BookManagementPage';
import UserManagementPage from '../../pages/UserManagementPage';
import WelcomePage from '../../pages/WelcomePage';

export type Page = 'welcome' | 'search' | 'books' | 'users';

const LibrarianDashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');

  const renderContent = useMemo(() => {
    switch (currentPage) {
      case 'search':
        return <BookSearchPage />;
      case 'books':
        return <BookManagementPage />;
      case 'users':
        return <UserManagementPage />;
      case 'welcome':
      default:
        return <WelcomePage/>;
    }
  }, [currentPage]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {renderContent}
      </main>
    </div>
  );
};

export default LibrarianDashboardLayout;