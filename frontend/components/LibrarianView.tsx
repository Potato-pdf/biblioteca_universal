import React, { useState } from 'react';
import { Book, User, UserRole } from '../types';
import { Trash2, Edit, Plus, Save, BookOpen, Users, X, GraduationCap, LayoutGrid } from 'lucide-react';

interface LibrarianViewProps {
  books: Book[];
  users: User[];
  onCreateBook: (formData: FormData) => Promise<boolean>;
  onUpdateBook: (id: string, formData: FormData) => Promise<boolean>;
  onDeleteBook: (id: string) => Promise<boolean>;
  onCreateUser: (userData: any) => Promise<boolean>;
  onUpdateUser: (id: string, userData: any) => Promise<boolean>;
  onDeleteUser: (id: string) => Promise<boolean>;
}

export const LibrarianView: React.FC<LibrarianViewProps> = ({ 
  books, 
  users, 
  onCreateBook,
  onUpdateBook,
  onDeleteBook,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');
  const [isEditing, setIsEditing] = useState(false);
  const [editingBook, setEditingBook] = useState<Partial<Book>>({});
  const [editingUser, setEditingUser] = useState<Partial<User>>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // CRUD Logic Helpers - Ahora usa el backend
  const handleDeleteBook = async (id: string) => {
    if (window.confirm('¿Eliminar libro del registro?')) {
      await onDeleteBook(id);
    }
  };
  
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook.title || !editingBook.author) return;
    
    const formData = new FormData();
    formData.append('titulo', editingBook.title);
    formData.append('autor', editingBook.author);
    formData.append('descripcion', editingBook.description || '');
    formData.append('fechaPublicacion', (editingBook.publishedYear || new Date().getFullYear()).toString());
    
    if (pdfFile) formData.append('pdf', pdfFile);
    if (coverFile) formData.append('portada', coverFile);
    
    const success = editingBook.id 
      ? await onUpdateBook(editingBook.id, formData)
      : await onCreateBook(formData);
    
    if (success) {
      setIsEditing(false);
      setEditingBook({});
      setPdfFile(null);
      setCoverFile(null);
    }
  };
  
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await onDeleteUser(id);
    }
  };
  
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser.username || !editingUser.name) return;
    
    const userData = {
      nombre: editingUser.name,
      email: editingUser.username + '@biblioteca.edu',
      password: '123456', // Contraseña temporal
      rol: editingUser.role === UserRole.LIBRARIAN ? 'bibliotecario' : 'alumno'
    };
    
    const success = editingUser.id
      ? await onUpdateUser(editingUser.id, userData)
      : await onCreateUser(userData);
    
    if (success) {
      setIsEditing(false);
      setEditingUser({});
    }
  };

  // UI Helper components for forms
  const Input = (props: any) => <input {...props} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:border-indigo-deep focus:ring-1 focus:ring-indigo-deep outline-none transition-all" />;
  const Label = ({children}: any) => <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{children}</label>;

  return (
    <div className="animate-fade-in-up">
      {/* Dashboard Header */}
      <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zen-ink">Gestión de Biblioteca</h2>
          <p className="text-stone-500 mt-1">Panel de administración y control de recursos</p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button 
            onClick={() => { setActiveTab('books'); setIsEditing(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'books' ? 'bg-white text-indigo-deep shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <BookOpen size={18} /> Libros
          </button>
          <button 
            onClick={() => { setActiveTab('users'); setIsEditing(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white text-indigo-deep shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Users size={18} /> Usuarios
          </button>
        </div>
      </div>

      {/* Main Panel Area */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden min-h-[600px]">
        
        {/* --- BOOKS SECTION --- */}
        {activeTab === 'books' && (
          <div className="p-6">
            {isEditing ? (
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-zen-ink">{editingBook.id ? 'Editar Libro' : 'Registrar Nuevo Libro'}</h3>
                  <button onClick={() => setIsEditing(false)}><X className="text-stone-400 hover:text-red-500"/></button>
                </div>
                <form onSubmit={handleSaveBook} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Título</Label><Input value={editingBook.title || ''} onChange={(e: any) => setEditingBook({...editingBook, title: e.target.value})} required /></div>
                    <div><Label>Autor</Label><Input value={editingBook.author || ''} onChange={(e: any) => setEditingBook({...editingBook, author: e.target.value})} required /></div>
                  </div>
                  <div><Label>Universidad</Label><Input value={editingBook.university || 'Universidad Central'} onChange={(e: any) => setEditingBook({...editingBook, university: e.target.value})} required /></div>
                  <div><Label>Descripción</Label><textarea className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm h-32 focus:border-indigo-deep outline-none" value={editingBook.description || ''} onChange={e => setEditingBook({...editingBook, description: e.target.value})} /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Año</Label><Input type="number" value={editingBook.publishedYear || ''} onChange={(e: any) => setEditingBook({...editingBook, publishedYear: parseInt(e.target.value)})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Archivo PDF {!editingBook.id && <span className="text-red-500">*</span>}</Label>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:border-indigo-deep outline-none transition-all"
                        required={!editingBook.id}
                      />
                      {editingBook.pdfUrl && <p className="text-xs text-stone-500 mt-1">PDF actual: {editingBook.pdfUrl.split('/').pop()}</p>}
                    </div>
                    <div>
                      <Label>Imagen Portada {!editingBook.id && <span className="text-red-500">*</span>}</Label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:border-indigo-deep outline-none transition-all"
                        required={!editingBook.id}
                      />
                      {editingBook.coverUrl && <p className="text-xs text-stone-500 mt-1">Portada actual disponible</p>}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-stone-500 hover:bg-stone-100 rounded-md">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-deep text-white rounded-md hover:bg-indigo-900 flex items-center gap-2"><Save size={18}/> Guardar Cambios</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-lg font-bold">Catálogo Actual</h3>
                  <button onClick={() => {setEditingBook({university: 'Universidad Central'}); setIsEditing(true);}} className="bg-zen-ink text-white px-4 py-2 rounded-md hover:bg-stone-800 flex items-center gap-2 text-sm">
                    <Plus size={16}/> Nuevo Libro
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {books.map(book => (
                    <div key={book.id} className="flex items-center p-4 border border-stone-100 rounded-lg hover:border-stone-300 hover:shadow-sm transition-all bg-stone-50/50 group">
                      <img src={book.coverUrl} className="w-12 h-16 object-cover rounded shadow-sm mr-4" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-zen-ink">{book.title}</h4>
                        <p className="text-sm text-stone-500">{book.author} • <span className="text-indigo-deep">{book.university}</span></p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => {setEditingBook(book); setIsEditing(true);}} className="p-2 hover:bg-blue-50 text-blue-600 rounded"><Edit size={18}/></button>
                        <button onClick={() => handleDeleteBook(book.id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- USERS SECTION --- */}
        {activeTab === 'users' && (
          <div className="p-6">
             {isEditing ? (
               <div className="max-w-xl mx-auto mt-8">
                 <h3 className="text-xl font-bold text-zen-ink mb-6">{editingUser.id ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                 <form onSubmit={handleSaveUser} className="space-y-4">
                   <div><Label>Nombre Completo</Label><Input value={editingUser.name || ''} onChange={(e: any) => setEditingUser({...editingUser, name: e.target.value})} required /></div>
                   <div><Label>Usuario (Login)</Label><Input value={editingUser.username || ''} onChange={(e: any) => setEditingUser({...editingUser, username: e.target.value})} required /></div>
                   <div>
                     <Label>Rol</Label>
                     <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}>
                       <option value={UserRole.STUDENT}>Estudiante</option>
                       <option value={UserRole.LIBRARIAN}>Bibliotecario</option>
                     </select>
                   </div>
                   <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-stone-500 hover:bg-stone-100 rounded-md">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-deep text-white rounded-md hover:bg-indigo-900 flex items-center gap-2"><Save size={18}/> Guardar</button>
                  </div>
                 </form>
               </div>
             ) : (
               <>
                 <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-lg font-bold">Usuarios Registrados</h3>
                  <button onClick={() => {setEditingUser({role: UserRole.STUDENT}); setIsEditing(true);}} className="bg-zen-ink text-white px-4 py-2 rounded-md hover:bg-stone-800 flex items-center gap-2 text-sm">
                    <Plus size={16}/> Nuevo Usuario
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map(user => (
                    <div key={user.id} className="p-4 border border-stone-200 rounded-lg flex items-start justify-between hover:shadow-md transition-shadow bg-white">
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === UserRole.LIBRARIAN ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                          {user.role === UserRole.LIBRARIAN ? <LayoutGrid size={20}/> : <GraduationCap size={20}/>}
                        </div>
                        <div>
                          <p className="font-bold text-zen-ink">{user.name}</p>
                          <p className="text-sm text-stone-500">@{user.username}</p>
                          <span className="text-xs text-stone-400 font-mono mt-1 block">{user.role}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                         <button onClick={() => {setEditingUser(user); setIsEditing(true);}} className="text-stone-400 hover:text-blue-600"><Edit size={16}/></button>
                         {user.id !== '1' && <button onClick={() => handleDeleteUser(user.id)} className="text-stone-400 hover:text-red-600"><Trash2 size={16}/></button>}
                      </div>
                    </div>
                  ))}
                </div>
               </>
             )}
          </div>
        )}
      </div>
    </div>
  );
};