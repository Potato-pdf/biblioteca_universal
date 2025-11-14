import { User, Book, UserRole, DataSource } from '../types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Ana Torres (Bibliotecaria)', email: 'ana.t@school.edu', role: UserRole.Librarian, source: DataSource.Internal },
  { id: 'user-2', name: 'Carlos Ruiz (Bibliotecario)', email: 'carlos.r@school.edu', role: UserRole.Librarian, source: DataSource.Internal },
  { id: 'user-3', name: 'Pedro Gomez (Alumno)', email: 'pedro.g@school.edu', role: UserRole.Student, source: DataSource.Internal },
  { id: 'user-4', name: 'Sofia Luna (Alumna)', email: 'sofia.l@school.edu', role: UserRole.Student, source: DataSource.Internal },
  { id: 'user-5', name: 'John Doe (Externo)', email: 'john.d@external.edu', role: UserRole.Student, source: DataSource.External },
];

export const mockBooks: Book[] = [
  // Libros Internos
  { id: 'book-1', title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', isbn: '978-0307350438', source: DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book1/300/450' },
  { id: 'book-2', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '978-8424117926', source: DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book2/300/450' },
  { id: 'book-3', title: 'La Sombra del Viento', author: 'Carlos Ruiz Zafón', isbn: '978-8408061645', source:DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book3/300/450' },
  { id: 'book-4', title: 'Ficciones', author: 'Jorge Luis Borges', isbn: '978-0802145765', source: DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book4/300/450' },
  { id: 'book-9', title: 'Rayuela', author: 'Julio Cortázar', isbn: '978-8466336678', source: DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book9/300/450' },
  { id: 'book-10', title: 'El Aleph', author: 'Jorge Luis Borges', isbn: '978-8420633118', source: DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book10/300/450' },
  { id: 'book-11', title: 'La Casa de los Espíritus', author: 'Isabel Allende', isbn: '978-0525243169', source: DataSource.Internal, coverUrl: 'https://picsum.photos/seed/book11/300/450' },

  // Libros Externos
  { id: 'book-5', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0618640157', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book5/300/450' },
  { id: 'book-6', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book6/300/450' },
  { id: 'book-7', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book7/300/450' },
  { id: 'book-8', title: '1984', author: 'George Orwell', isbn: '978-0451524935', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book8/300/450' },
  { id: 'book-12', title: 'Dune', author: 'Frank Herbert', isbn: '978-0441013593', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book12/300/450' },
  { id: 'book-13', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', isbn: '978-0345391803', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book13/300/450' },
  { id: 'book-14', title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060850524', source: DataSource.External, coverUrl: 'https://picsum.photos/seed/book14/300/450' },
];