// Main App - Role-based routing with MVC/MVVM architecture
import React from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LoginView } from "./src/views/LoginView";
import { SearchView } from "./src/views/SearchView";
import { BookManagementView } from "./src/views/BookManagementView";
import { UserManagementView } from "./src/views/UserManagementView";
import { LogOut, BookOpen, Users, Search } from "lucide-react";

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isBibliotecario, logout } = useAuth();
  const [currentView, setCurrentView] = React.useState<"search" | "books" | "users">("search");

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Biblioteca Universal
              </h1>
              
              {/* Navigation Tabs */}
              <div className="ml-10 flex space-x-4">
                <button
                  onClick={() => setCurrentView("search")}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                    currentView === "search"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Search size={18} />
                  Buscar
                </button>

                {isBibliotecario && (
                  <>
                    <button
                      onClick={() => setCurrentView("books")}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                        currentView === "books"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <BookOpen size={18} />
                      Libros
                    </button>

                    <button
                      onClick={() => setCurrentView("users")}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                        currentView === "users"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Users size={18} />
                      Usuarios
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.nombre}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {currentView === "search" && <SearchView />}
        {currentView === "books" && isBibliotecario && <BookManagementView />}
        {currentView === "users" && isBibliotecario && <UserManagementView />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;