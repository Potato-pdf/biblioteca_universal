import React, { useState, useMemo, useContext } from 'react';
import { mockBooks } from '../data/mockData';
import { Book, DataSource, UserRole } from '../types';
import { AuthContext } from '../context/AuthContext';

const BookCardGrid: React.FC<{ book: Book }> = ({ book }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
    <div className="relative">
        <img src={book.coverUrl} alt={`Portada de ${book.title}`} className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute top-0 right-0 m-2">
             <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
              book.source === DataSource.Internal 
                ? 'bg-primary-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {book.source === DataSource.Internal ? 'Interno' : 'Externo'}
            </span>
        </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 truncate" title={book.title}>{book.title}</h3>
      <p className="text-gray-500 text-sm">{book.author}</p>
    </div>
  </div>
);

const BookCardCarousel: React.FC<{ book: Book }> = ({ book }) => (
  <div className="flex-shrink-0 w-48 group">
    <div className="relative rounded-lg shadow-md overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-300">
      <img 
        src={book.coverUrl} 
        alt={`Portada de ${book.title}`} 
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
      />
    </div>
    <div className="mt-3">
      <h3 className="text-md font-bold text-gray-800 truncate" title={book.title}>{book.title}</h3>
      <p className="text-gray-500 text-sm">{book.author}</p>
    </div>
  </div>
);

const BookCarousel: React.FC<{ title: string; books: Book[] }> = ({ title, books }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
    <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {books.map(book => <BookCardCarousel key={book.id} book={book} />)}
    </div>
  </section>
);


const LibrarianView: React.FC<{ books: Book[], searchTerm: string, setSearchTerm: (term: string) => void }> = ({ books, searchTerm, setSearchTerm }) => (
  <div className="container mx-auto">
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-extrabold text-gray-800">Catálogo Unificado de Recursos</h1>
      <p className="text-lg text-gray-500 mt-2">Busque en el catálogo interno y en las colecciones de bibliotecas asociadas.</p>
    </header>
    
    <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text"
            placeholder="Busca por título, autor o ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-12 py-4 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-shadow"
          />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {books.length > 0 ? (
        books.map(book => <BookCardGrid key={book.id} book={book} />)
      ) : (
        <div className="text-center col-span-full py-16">
          <p className="text-2xl font-semibold text-gray-700">No se encontraron resultados.</p>
          <p className="text-gray-500 mt-2">Intente con otras palabras clave.</p>
        </div>
      )}
    </div>
  </div>
);

const StudentView: React.FC<{ books: Book[], searchTerm: string, setSearchTerm: (term: string) => void }> = ({ books, searchTerm, setSearchTerm }) => {
  const internalBooks = useMemo(() => books.filter(b => b.source === DataSource.Internal), [books]);
  const externalBooks = useMemo(() => books.filter(b => b.source === DataSource.External), [books]);

  return (
    <div>
       <section className="relative h-80 flex items-center justify-center text-center p-6 overflow-hidden mb-12 w-full">
        <img src="https://picsum.photos/seed/librarybg/1600/500" alt="Fondo de biblioteca" className="absolute top-0 left-0 w-full h-full object-cover"/>
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div> {/* Optional: a subtle dark overlay for better text contrast if needed */}
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white [text-shadow:2px_2px_8px_rgba(0,0,0,0.7)]">Explore el Conocimiento Global</h1>
          <div className="mt-8 relative w-full max-w-xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder="Busque su próximo recurso académico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-12 py-4 bg-white border border-gray-200 rounded-full shadow-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-primary-400 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {searchTerm ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {books.length > 0 ? (
              books.map(book => <BookCardGrid key={book.id} book={book} />)
            ) : (
               <div className="text-center col-span-full py-16">
                <p className="text-2xl font-semibold text-gray-700">No se encontraron resultados.</p>
                <p className="text-gray-500 mt-2">Intente con otras palabras clave.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <BookCarousel title="Colección Principal de la Universidad" books={internalBooks} />
            
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Recursos de Bibliotecas Externas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {externalBooks.map(book => <BookCardGrid key={book.id} book={book} />)}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};


const BookSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  const filteredBooks = useMemo(() => {
    if (!searchTerm) return mockBooks;
    return mockBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (user?.role === UserRole.Student) {
    return <StudentView books={filteredBooks} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
  }

  return <LibrarianView books={filteredBooks} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
};

export default BookSearchPage;