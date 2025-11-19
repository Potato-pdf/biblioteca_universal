# Integración Frontend-Backend - Biblioteca Universal Hanami

## ✅ Reglas de Arquitectura Cumplidas

### a) Frontend NO consulta bases de datos externas
- ❌ El frontend **NUNCA** consulta APIs externas directamente
- ✅ El frontend **SOLO** consulta el backend local
- ✅ El backend decide si llama a universidad local o externa
- ✅ El backend retorna todo en ViewModels unificados

### b) Frontend NO construye sus propios modelos
- ❌ El frontend **NUNCA** construye ViewModels
- ✅ El frontend **SOLO** recibe ViewModels del backend
- ✅ Los ViewModels del frontend coinciden EXACTAMENTE con los del backend
- ✅ Se usan mappers para convertir ViewModels a tipos del UI (Book, User)

### c) Formato de envío de archivos (PDF / Portada)
- ✅ Se usa `FormData` para enviar archivos
- ✅ Los archivos PDF y portadas se suben al backend
- ✅ El backend maneja el storage (UploadThing)

## 📁 Estructura Frontend

```
frontend/
├── App.tsx                          # Componente principal con diseño Sakura
├── components/
│   ├── LibrarianView.tsx            # Panel admin con CRUD
│   ├── SakuraCanvas.tsx             # Animación pétalos
│   └── ui/
│       ├── BookCard.tsx             # Tarjeta de libro
│       └── Modal.tsx                # Modal de detalles
├── src/
│   ├── context/
│   │   └── AuthContext.tsx          # Estado de autenticación
│   ├── controllers/                 # Hooks que usan apiService
│   │   ├── auth.controller.ts       # Login/Logout
│   │   ├── search.controller.ts     # Búsqueda (interno+externo)
│   │   ├── book.controller.ts       # CRUD libros
│   │   └── user.controller.ts       # CRUD usuarios
│   ├── services/
│   │   └── api.service.ts           # HTTP client (fetch API)
│   ├── viewmodels/                  # Interfaces que coinciden con backend
│   │   ├── book.viewmodel.ts        # BookViewModel
│   │   ├── user.viewmodel.ts        # UserViewModel
│   │   └── auth.viewmodel.ts        # LoginRequest/Response
│   └── utils/
│       └── mappers.ts               # Conversión ViewModel ↔ UI types
├── types.ts                         # Tipos del diseño UI (Book, User)
└── constants.ts                     # Constantes (ya no se usan mocks)
```

## 🔄 Flujo de Datos

### Login
```
Usuario → App.tsx → useAuthController → apiService.login()
       ← Backend ← UserViewModel ← AuthController (backend)
```

### Búsqueda (Interno + Externo)
```
Usuario escribe → handleSearch() → searchBooks(query)
                → apiService.searchBooks() → Backend
                → Backend decide: ¿DB interna o API externa?
                → Backend retorna BookViewModel[]
                ← Frontend mapea a Book[] → Muestra en UI
```

### CRUD Libros (Bibliotecario)
```
Bibliotecario → Formulario con archivos (PDF + Portada)
             → FormData con: titulo, autor, descripcion, pdf, portada
             → createBook(formData) → apiService.createBook()
             → Backend (Hono) → Procesa archivos → Storage
             ← BookViewModel ← Se agrega a la lista
```

### CRUD Usuarios (Bibliotecario)
```
Bibliotecario → Formulario de usuario
             → createUser({nombre, email, password, rol})
             → apiService.createUser()
             → Backend crea usuario
             ← UserViewModel ← Se agrega a la lista
```

## 🎨 Diseño Original Preservado

- ✅ Split-screen login con Sakura animation
- ✅ Hero section con templo japonés
- ✅ Barra de búsqueda flotante
- ✅ Featured book section
- ✅ Grid de libros con BookCard
- ✅ Modal con PDF viewer
- ✅ Panel de bibliotecario con tabs
- ✅ Colores: sakura-vivid (#FB7185), zen-ink (#1A1A1A), indigo-deep (#312E81)
- ✅ Fuentes: Cinzel (display), Noto Serif JP (serif), Zen Kaku Gothic New (sans)
- ✅ Animaciones: fade-in-up, float, pulse-slow

## 🔌 Endpoints Backend Usados

```typescript
POST   /api/users/login           // Login
GET    /api/books                 // Listar libros internos
GET    /api/books/search?q=...    // Buscar (interno + externo)
POST   /api/books                 // Crear libro (FormData)
PUT    /api/books/:id             // Actualizar libro (FormData)
DELETE /api/books/:id             // Eliminar libro
GET    /api/users                 // Listar usuarios
POST   /api/users                 // Crear usuario
PUT    /api/users/:id             // Actualizar usuario
DELETE /api/users/:id             // Eliminar usuario
```

## 📦 ViewModels (Coinciden con Backend)

### BookViewModel
```typescript
{
  idLibro: string;
  titulo: string;
  universidad: string;
  portadaUrl: string;
  pdfUrl: string;
  autor: string;
  descripcion: string;
  fechaPublicacion: string;
}
```

### UserViewModel
```typescript
{
  id: string;
  nombre: string;
  email: string;
  rol: string; // 'bibliotecario' | 'alumno'
}
```

## 🚀 Uso

1. Backend corriendo en `http://localhost:3001`
2. Frontend corriendo en `http://localhost:3000`
3. Login con email/password (backend valida)
4. Búsqueda: frontend pide al backend, backend decide fuente
5. CRUD: bibliotecario usa formularios con archivos
6. Todo se maneja vía ViewModels del backend

## ✨ Características

- ✅ Arquitectura limpia (Frontend NO accede a DB externas)
- ✅ ViewModels como única fuente de verdad
- ✅ FormData para archivos (PDF + imágenes)
- ✅ Diseño Sakura/Hanami intacto
- ✅ Búsqueda unificada (interno + externo)
- ✅ CRUD completo para bibliotecarios
- ✅ Autenticación con JWT (opcional)
