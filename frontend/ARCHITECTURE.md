# Frontend Architecture - Biblioteca Universal

## 📁 Structure

```
frontend/src/
├── context/          # React Context for global state
│   └── AuthContext.tsx
├── controllers/      # State management & API coordination (NO UI)
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── book.controller.ts
│   └── search.controller.ts
├── services/         # HTTP communication with backend (NO LOGIC)
│   └── api.service.ts
├── viewmodels/       # TypeScript interfaces matching backend
│   ├── user.viewmodel.ts
│   └── book.viewmodel.ts
├── views/            # React components (NO BUSINESS LOGIC)
│   ├── LoginView.tsx
│   ├── SearchView.tsx
│   ├── BookManagementView.tsx
│   ├── UserManagementView.tsx
│   ├── ImageUpload.tsx
│   └── PdfUpload.tsx
└── hooks/            # Custom React hooks
    └── useUploadThing.ts
```

## 🏗️ Architecture Principles

### MVC/MVVM Pattern

1. **ViewModels** (`src/viewmodels/`)
   - TypeScript interfaces matching backend structure EXACTLY
   - NO LOGIC - only data type definitions
   - Match backend ViewModels 1:1

2. **Controllers** (`src/controllers/`)
   - Custom React hooks for state management
   - Coordinate between Services and Views
   - Handle loading, error states
   - NO UI CODE

3. **Views** (`src/views/`)
   - Pure React components
   - NO BUSINESS LOGIC
   - Only UI rendering and user interactions
   - Call controllers for data operations

4. **Services** (`src/services/`)
   - HTTP communication with backend
   - NO BUSINESS LOGIC
   - Only fetch/post/put/delete operations

## 🔐 Authentication Flow

1. User enters credentials in `LoginView`
2. `useAuthController` calls `apiService.login()`
3. Backend returns user data
4. Store user in `AuthContext` and localStorage
5. Role-based routing shows different views

## 📚 Data Flow

### Search Books
```
SearchView → useSearchController → apiService.searchBooks() 
→ Backend /buscar/libros → Returns BookViewModel[]
→ Controller updates state → View displays results
```

### Create Book (Bibliotecario only)
```
1. Upload image via ImageUpload → UploadThing → Get imageUrl
2. Upload PDF via PdfUpload → UploadThing → Get pdfUrl
3. Fill form in BookManagementView
4. useBookController.createBook() → apiService.createBook()
5. Backend creates book → Returns BookViewModel
6. Controller updates local state → View refreshes
```

## 🎯 Role-Based Access

### Alumno (Student)
- ✅ Search books (internal + external sources)
- ✅ View book details
- ❌ NO CRUD operations

### Bibliotecario (Librarian)
- ✅ All Alumno permissions
- ✅ Manage books (CRUD)
- ✅ Manage users (CRUD)
- ✅ Upload images and PDFs

## 📡 Backend API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout

### Users (Bibliotecario only)
- `GET /usuarios` - Get all users
- `GET /usuarios/:id` - Get user by ID
- `POST /usuarios` - Create user
- `PUT /usuarios/:id` - Update user
- `DELETE /usuarios/:id` - Delete user

### Books (Bibliotecario only for mutations)
- `GET /libros` - Get all books
- `GET /libros/:id` - Get book by ID
- `POST /libros` - Create book
- `PUT /libros/:id` - Update book
- `DELETE /libros/:id` - Delete book

### Search (All users)
- `GET /buscar/libros?titulo=X` - Search internal + external (UTL, UNAM, Oxford)
- `GET /buscar/libro?id=X&universidad=Y` - View specific book

### File Upload
- `POST /api/uploadthing` - UploadThing endpoint (images & PDFs)

## 🚀 Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔑 Environment Variables

Create `.env` file:
```
VITE_UPLOADTHING_TOKEN=<your-token>
VITE_API_URL=http://localhost:3000
```

## 📦 Key Dependencies

- **React 19.2.0** - UI framework
- **TypeScript** - Type safety
- **uploadthing** - File uploads
- **@uploadthing/react** - React components
- **lucide-react** - Icons

## ⚠️ Important Rules

1. **NO LOGIC IN VIEWS** - Only UI rendering
2. **NO DIRECT DATABASE ACCESS** - Always use backend API
3. **USE BACKEND VIEWMODELS AS-IS** - Don't create custom models
4. **UPLOAD FILES FIRST** - Get URLs before sending to backend
5. **ROLE-BASED UI** - Show/hide features based on user.rol

## 🔄 State Management

- **AuthContext** - Global authentication state
- **Controllers** - Component-level state with React hooks
- **localStorage** - Persist user session

## 🎨 Styling

- Tailwind CSS for utility classes
- Responsive design (mobile-first)
- Clean, minimal UI
