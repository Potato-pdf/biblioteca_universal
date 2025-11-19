import React, { useState, useEffect } from 'react';
import { User, Book, UserRole } from './types';
import SakuraCanvas from './components/SakuraCanvas';
import { BookCard } from './components/ui/BookCard';
import { Modal } from './components/ui/Modal';
import { LibrarianView } from './components/LibrarianView';
import { LogOut, Search, BookOpen, Flower2, Sparkles, ArrowRight } from 'lucide-react';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { useAuthController } from './src/controllers/auth.controller';
import { useSearchController } from './src/controllers/search.controller';
import { useBookController } from './src/controllers/book.controller';
import { useUserController } from './src/controllers/user.controller';
import { mapBookViewModelToBook, mapUserViewModelToUser } from './src/utils/mappers';

const AppContent: React.FC = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const { login: loginBackend, logout: logoutBackend, loading: loginLoading, error: loginError } = useAuthController();
  const { searchBooks, loading: searchLoading } = useSearchController();
  const { books: backendBooks, loadBooks, createBook, updateBook, deleteBook } = useBookController();
  const { users: backendUsers, loadUsers, createUser, updateUser, deleteUser } = useUserController();

  // App State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Data State - mapeo de ViewModels a tipos del diseño
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  // View State
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos al autenticarse
  useEffect(() => {
    if (isAuthenticated) {
      loadBooks();
      if (authUser?.rol === 'bibliotecario') {
        loadUsers();
      }
    }
  }, [isAuthenticated]);

  // Mapear datos del backend a tipos del frontend
  useEffect(() => {
    setBooks(backendBooks.map(mapBookViewModelToBook));
  }, [backendBooks]);

  useEffect(() => {
    setUsers(backendUsers.map(mapUserViewModelToUser));
  }, [backendUsers]);

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginBackend(emailInput, passwordInput);
  };

  const handleLogout = () => {
    logoutBackend();
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    // El backend decide si busca interno o externo
    const results = await searchBooks(searchTerm);
    setSearchResults(results.map(mapBookViewModelToBook));
  };

  const filteredBooks = searchTerm ? searchResults : books;
  
  // Featured book logic (just grab the first one for demo)
  const featuredBook = books.length > 0 ? books[0] : null;
  const gridBooks = books.length > 0 ? books.slice(1) : [];

  const user = authUser ? mapUserViewModelToUser(authUser) : null;

  // --- LOGIN SCREEN (REDESIGNED - SPLIT SCREEN) ---
  if (!user) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-zen-bg">
        
        {/* Left Side: Image & Animation (60% width on desktop) */}
        <div className="hidden md:block md:w-1/2 lg:w-3/5 relative bg-stone-900 overflow-hidden">
           {/* Image Background */}
           <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2076&auto=format&fit=crop" 
               alt="Árbol Sakura"
               className="w-full h-full object-cover object-center opacity-90 transition-transform duration-[20s] hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
           </div>
           
           {/* Sakura Canvas Overlay */}
           <div className="absolute inset-0 z-10">
              <SakuraCanvas />
           </div>

           {/* Text Overlay */}
           <div className="absolute bottom-12 left-12 z-20 text-white max-w-md">
              <h2 className="font-display text-5xl font-bold mb-4 drop-shadow-lg">Hanami</h2>
              <p className="font-serif text-xl italic text-white/90 drop-shadow-md">
                "La belleza del aprendizaje florece en cada página."
              </p>
           </div>
        </div>

        {/* Right Side: Form (40% width on desktop) */}
        <div className="w-full md:w-1/2 lg:w-2/5 relative flex flex-col justify-center items-center p-8 md:p-16 bg-white">
            {/* Mobile-only subtle sakura hint */}
            <div className="md:hidden absolute inset-0 z-0 opacity-20 pointer-events-none">
               <SakuraCanvas />
            </div>

            <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
              <div className="flex justify-center mb-10">
                <div className="w-16 h-16 rounded-full bg-zen-ink text-white flex items-center justify-center shadow-xl">
                  <Flower2 size={32} />
                </div>
              </div>

              <div className="text-center mb-10">
                <h1 className="text-3xl font-display font-bold text-zen-ink mb-2">Bienvenido</h1>
                <p className="text-stone-500">Ingresa tus credenciales para acceder</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 tracking-widest uppercase ml-1">Email</label>
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-4 bg-white border-b-2 border-stone-200 focus:border-sakura-vivid outline-none transition-all text-lg text-zen-ink placeholder-stone-300"
                    placeholder="usuario@ejemplo.com"
                    disabled={loginLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 tracking-widest uppercase ml-1">Contraseña</label>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-4 bg-white border-b-2 border-stone-200 focus:border-sakura-vivid outline-none transition-all text-lg text-zen-ink placeholder-stone-300"
                    placeholder="••••••••"
                    disabled={loginLoading}
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
                    {loginError}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 bg-zen-ink hover:bg-stone-800 text-white rounded-sm shadow-lg font-medium tracking-wide transition-all transform hover:-translate-y-1 flex justify-center items-center gap-3 mt-8 disabled:opacity-50"
                >
                  <span>{loginLoading ? 'INICIANDO...' : 'INGRESAR'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-12 text-center">
                 <p className="text-xs text-stone-400 uppercase tracking-widest">Biblioteca Universitaria v3.0</p>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // --- MAIN APPLICATION ---
  return (
    <div className="min-h-screen bg-stone-50 text-zen-ink font-sans">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-zen-ink text-white p-2 rounded-sm shadow-md">
                <Flower2 size={24} />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-zen-ink">Hanami<span className="text-sakura-vivid">.</span>Lib</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-zen-ink">{user.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <div className={`w-2 h-2 rounded-full ${user.role === UserRole.LIBRARIAN ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">{user.role === UserRole.LIBRARIAN ? 'Bibliotecario' : 'Estudiante'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-full"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pb-20">
        
        {user.role === UserRole.LIBRARIAN ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <LibrarianView 
              books={books} 
              users={users} 
              onCreateBook={createBook}
              onUpdateBook={updateBook}
              onDeleteBook={deleteBook}
              onCreateUser={createUser}
              onUpdateUser={updateUser}
              onDeleteUser={deleteUser}
            />
          </div>
        ) : (
          <div className="animate-fade-in-up">
            
            {/* HERO SECTION with Search */}
            <div className="relative w-full h-[450px] bg-stone-900 mb-12 overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop" 
                alt="Templo Japonés" 
                className="w-full h-full object-cover opacity-90 transition-transform duration-[60s] hover:scale-110"
              />
              {/* Simple gradient, not a full blur, to let the image shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-4 z-10">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-xl text-center tracking-wide">
                  Explora la Sabiduría
                </h2>
                <p className="text-white/90 text-lg mb-10 font-serif italic text-center max-w-2xl drop-shadow-md">
                  "Un libro es un sueño que tienes en tus manos."
                </p>

                {/* Floating Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl relative transform transition-all duration-300 hover:-translate-y-1">
                   <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Search className="text-stone-400" size={20}/>
                   </div>
                   <input
                    type="text"
                    className="block w-full pl-14 pr-6 py-5 rounded-sm border-0 bg-white text-lg placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-sakura-vivid/20 shadow-2xl text-zen-ink"
                    placeholder="Buscar título, autor, universidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <div className="absolute right-2 top-2 bottom-2">
                     <button type="submit" className="bg-zen-ink text-white h-full px-8 rounded-sm font-medium hover:bg-stone-700 transition-colors" disabled={searchLoading}>
                       {searchLoading ? 'Buscando...' : 'Buscar'}
                     </button>
                   </div>
                </form>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* FEATURED SECTION */}
              {!searchTerm && featuredBook && (
                <div className="mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                   <div className="flex items-center gap-2 mb-6 border-b border-stone-300 pb-2">
                      <Sparkles className="text-sakura-vivid" size={20}/>
                      <h3 className="text-xl font-serif font-bold text-zen-ink uppercase tracking-widest">Lectura Destacada</h3>
                   </div>
                   <div 
                     className="bg-white rounded-sm shadow-xl overflow-hidden flex flex-col md:flex-row cursor-pointer group border border-stone-100 hover:shadow-2xl transition-all duration-500"
                     onClick={() => setSelectedBook(featuredBook)}
                   >
                      <div className="md:w-1/3 h-80 md:h-auto relative overflow-hidden">
                        <img 
                          src={featuredBook.coverUrl} 
                          alt={featuredBook.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-stone-50/80 backdrop-blur-sm">
                        <div className="inline-block bg-zen-ink text-white text-xs font-bold px-3 py-1 mb-4 tracking-widest self-start">
                          RECOMENDADO
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-zen-ink mb-2 group-hover:text-sakura-vivid transition-colors">{featuredBook.title}</h2>
                        <p className="text-lg text-stone-500 mb-6 font-serif italic">{featuredBook.author}</p>
                        <p className="text-stone-600 leading-relaxed mb-8 line-clamp-3 text-lg">{featuredBook.description}</p>
                        <div className="flex items-center text-sm font-bold text-zen-ink border-b-2 border-zen-ink self-start pb-1 group-hover:border-sakura-vivid group-hover:text-sakura-vivid transition-colors">
                          LEER AHORA <ArrowRight size={16} className="ml-2"/>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* GRID RESULTS */}
              <div className="flex items-center justify-between mb-8 border-b border-stone-300 pb-4">
                <h3 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                  <BookOpen size={20} className="text-sakura-vivid"/> 
                  Colección General
                </h3>
                <span className="text-sm text-stone-500 font-mono bg-white px-2 py-1 rounded border border-stone-200 shadow-sm">{filteredBooks.length} Resultados</span>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 pb-20">
                  {(searchTerm ? filteredBooks : gridBooks).map((book) => (
                    <BookCard key={book.id} book={book} onClick={setSelectedBook} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-60 bg-white/50 rounded-xl border-dashed border-2 border-stone-300">
                  <Flower2 size={48} className="mb-4 text-stone-300 animate-pulse-slow"/>
                  <p className="text-xl font-serif text-stone-500">No encontramos libros con ese criterio.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Details */}
      <Modal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        title={selectedBook?.title || ''}
      >
        {selectedBook && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
            {/* Info Column */}
            <div className="md:col-span-4 space-y-6">
              <div className="aspect-[2/3] w-full rounded-sm overflow-hidden shadow-2xl relative group">
                <img 
                  src={selectedBook.coverUrl} 
                  alt={selectedBook.title} 
                  className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
              </div>
              
              <div className="space-y-4 font-serif bg-stone-50 p-6 rounded-sm border border-stone-200">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1">Autor</p>
                  <p className="text-lg font-medium text-zen-ink">{selectedBook.author}</p>
                </div>
                <div className="h-px bg-stone-200 w-full"></div>
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1">Origen</p>
                  <p className="text-lg font-medium text-zen-ink flex items-center gap-2 text-indigo-deep">
                    {selectedBook.university}
                  </p>
                </div>
                 <div className="h-px bg-stone-200 w-full"></div>
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-1">Publicación</p>
                  <p className="text-lg font-medium text-zen-ink">{selectedBook.publishedYear}</p>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-bold text-stone-900 uppercase mb-2">Sinopsis</h4>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {selectedBook.description}
                </p>
              </div>
            </div>

            {/* Reader Column */}
            <div className="md:col-span-8 flex flex-col bg-white rounded-sm border border-stone-200 overflow-hidden h-[600px] md:h-auto shadow-lg ring-1 ring-stone-100">
              <div className="bg-stone-100 border-b border-stone-200 p-4 flex justify-between items-center px-6">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14}/> Vista Previa del Documento
                </span>
                <div className="flex space-x-2">
                   <button className="p-1 hover:bg-stone-200 rounded text-stone-500" title="Descargar PDF (Simulado)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                   </button>
                </div>
              </div>
              <div className="flex-1 bg-stone-200/50 relative overflow-hidden flex items-center justify-center p-8">
                 {/* PDF Simulation iframe */}
                 <div className="w-full h-full bg-white shadow-2xl overflow-y-auto custom-scrollbar relative border border-stone-300">
                    <iframe 
                      src={selectedBook.pdfUrl} 
                      className="w-full h-full"
                      title="Lector PDF"
                    />
                 </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
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