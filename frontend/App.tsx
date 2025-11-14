import React, { useState, useCallback, useContext } from 'react';
import LoginPage from './pages/LoginPage';
import LibrarianDashboardLayout from './components/layout/LibrarianDashboardLayout';
import StudentDashboardLayout from './components/layout/StudentDashboardLayout';
import { User, UserRole } from './types';
import { AuthContext } from './context/AuthContext';
import { mockUsers } from './data/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useCallback((userEmail: string) => {
    const user = mockUsers.find(u => u.email === userEmail);
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);
  
  const renderDashboard = () => {
    if (!currentUser) return null;

    switch(currentUser.role) {
      case UserRole.Librarian:
        return <LibrarianDashboardLayout />;
      case UserRole.Student:
        return <StudentDashboardLayout />;
      default:
        return <LoginPage users={mockUsers} />;
    }
  }

  return (
    <AuthContext.Provider value={{ user: currentUser, login, logout }}>
      <div className="min-h-screen">
        {currentUser ? renderDashboard() : <LoginPage users={mockUsers} />}
      </div>
    </AuthContext.Provider>
  );
};

export default App;