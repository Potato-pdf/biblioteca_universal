import type { BookViewModel } from '../viewmodels/book.viewmodel';
import type { UserViewModel } from '../viewmodels/user.viewmodel';
import type { Book, User, UserRole } from '../../types';

// Mapeo de BookViewModel (backend) a Book (frontend para UI)
export const mapBookViewModelToBook = (vm: BookViewModel): Book => ({
    id: vm.idLibro,
    title: vm.titulo,
    author: vm.autor,
    university: vm.universidad,
    description: vm.descripcion,
    coverUrl: vm.portadaUrl,
    pdfUrl: vm.pdfUrl,
    publishedYear: parseInt(vm.fechaPublicacion) || new Date().getFullYear(),
});

// Mapeo de UserViewModel (backend) a User (frontend para UI)
export const mapUserViewModelToUser = (vm: UserViewModel): User => ({
    id: vm.id,
    username: vm.email.split('@')[0], // username derivado del email
    name: vm.nombre,
    role: vm.rol === 'bibliotecario' ? 'LIBRARIAN' as UserRole : 'STUDENT' as UserRole,
});

// Mapeo inverso: Book (frontend) a FormData para crear/editar
export const bookToFormData = (book: Partial<Book>, pdfFile?: File, coverFile?: File): FormData => {
    const formData = new FormData();
    
    if (book.title) formData.append('titulo', book.title);
    if (book.author) formData.append('autor', book.author);
    if (book.description) formData.append('descripcion', book.description);
    if (book.publishedYear) formData.append('fechaPublicacion', book.publishedYear.toString());
    
    if (pdfFile) formData.append('pdf', pdfFile);
    if (coverFile) formData.append('portada', coverFile);
    
    return formData;
};

// Mapeo inverso: User (frontend) a datos para crear/editar
export const userToBackendData = (user: Partial<User>, password?: string) => ({
    nombre: user.name || '',
    email: user.username ? `${user.username}@biblioteca.edu` : '',
    password: password || '',
    rol: user.role === 'LIBRARIAN' ? 'bibliotecario' : 'alumno',
});
