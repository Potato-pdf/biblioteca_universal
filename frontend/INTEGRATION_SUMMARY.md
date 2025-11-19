# Frontend-Backend Integration Complete ✅

## 🎉 What We Built

### Complete Frontend Architecture Following MVC/MVVM Pattern

#### 📁 Folder Structure Created
```
frontend/src/
├── context/AuthContext.tsx          # Global authentication state
├── controllers/                     # State management (NO UI)
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── book.controller.ts
│   └── search.controller.ts
├── services/api.service.ts          # HTTP calls to backend
├── viewmodels/                      # TypeScript interfaces
│   ├── user.viewmodel.ts
│   └── book.viewmodel.ts
├── views/                           # React components (NO LOGIC)
│   ├── LoginView.tsx
│   ├── SearchView.tsx
│   ├── BookManagementView.tsx
│   ├── UserManagementView.tsx
│   ├── ImageUpload.tsx
│   └── PdfUpload.tsx
└── hooks/useUploadThing.ts          # UploadThing integration
```

## 🏗️ Architecture Principles Followed

### ✅ Strict Separation of Concerns
1. **ViewModels**: Only TypeScript interfaces matching backend EXACTLY
2. **Controllers**: State management and API coordination (custom React hooks)
3. **Views**: Pure UI components with NO business logic
4. **Services**: HTTP communication only, NO logic

### ✅ Backend as Source of Truth
- All data structures match backend ViewModels 1:1
- No frontend-specific data modeling
- Backend ViewModels consumed as-is

### ✅ Role-Based Access Control
- **Alumno (Student)**: Search and view books only
- **Bibliotecario (Librarian)**: Full CRUD access to books and users

## 🔌 Backend Integration

### API Service (`src/services/api.service.ts`)
Connects to all backend endpoints:

**Authentication**
- `POST /auth/login` → Login with email/password
- `POST /auth/logout` → Logout

**Users** (Bibliotecario only)
- `GET /usuarios` → Get all users
- `POST /usuarios` → Create user
- `PUT /usuarios/:id` → Update user
- `DELETE /usuarios/:id` → Delete user

**Books** (Bibliotecario for CRUD)
- `GET /libros` → Get all books
- `POST /libros` → Create book
- `PUT /libros/:id` → Update book
- `DELETE /libros/:id` → Delete book

**Search** (All users)
- `GET /buscar/libros?titulo=X` → Search internal + external (UTL, UNAM, Oxford)
- `GET /buscar/libro?id=X&universidad=Y` → View specific book

**File Upload**
- `POST /api/uploadthing` → Upload images/PDFs

## 📤 UploadThing Integration

### Image Upload Component
- Accepts images (JPG, PNG, GIF, WEBP)
- Max 4MB file size
- Uploads to UploadThing `bookCoverUploader` route
- Returns URL to parent component

### PDF Upload Component
- Accepts PDF files only
- Max 16MB file size
- Uploads to UploadThing `bookPdfUploader` route
- Returns URL to parent component

### Upload Flow
1. User selects file in upload component
2. Frontend uploads to UploadThing directly
3. UploadThing returns URL
4. Frontend includes URL in API request to backend
5. Backend stores URL in database (NOT the file)

## 🔐 Authentication Flow

1. User enters credentials in `LoginView`
2. `useAuthController` calls `apiService.login(credentials)`
3. Backend validates and returns user data
4. Store user in `AuthContext` and `localStorage`
5. App re-renders with role-based UI

## 🎯 Controllers (State Management)

### `useAuthController`
- Handles login/logout operations
- Manages loading and error states
- NO UI CODE

### `useUserController`
- Manages user CRUD operations
- Maintains local user list state
- Coordinates with API service

### `useBookController`
- Manages book CRUD operations
- Maintains local book list state
- Coordinates with API service

### `useSearchController`
- Handles search across multiple sources
- Manages search results state
- Clears search functionality

## 🖼️ Views (UI Components)

### `LoginView`
- Email/password form
- Displays errors
- Calls auth controller

### `SearchView`
- Search input
- Results grid
- Book detail modal with PDF viewer
- Available to ALL users

### `BookManagementView` (Bibliotecario only)
- Books grid with edit/delete buttons
- Create/Edit modal with form
- Image and PDF upload integration
- Form validation

### `UserManagementView` (Bibliotecario only)
- Users table
- Create/Edit modal with form
- Role selection (alumno/bibliotecario)
- Password handling (optional on update)

## 📦 Dependencies Installed

```json
{
  "uploadthing": "^7.7.4",
  "@uploadthing/react": "^7.7.4"
}
```

## ⚙️ Configuration Files

### `.env`
```env
VITE_UPLOADTHING_TOKEN=<token>
VITE_API_URL=http://localhost:3000
```

### `index.tsx`
- Imports UploadThing styles
- Wraps app in AuthProvider

### `App.tsx`
- Role-based routing
- Navigation with tabs
- Logout functionality

## 🚀 How to Run

### Start Backend
```bash
cd backend
bun run src/index.ts
```
Backend runs on `http://localhost:3000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📝 Architecture Documentation

Created `ARCHITECTURE.md` with:
- Complete folder structure explanation
- Architecture principles
- Data flow diagrams
- API endpoints reference
- Role-based access rules
- Environment setup

## ✅ Architecture Rules Enforced

1. ✅ **NO LOGIC IN VIEWS** - Only UI rendering
2. ✅ **NO DIRECT DB ACCESS** - Always through backend API
3. ✅ **USE BACKEND VIEWMODELS** - No custom frontend models
4. ✅ **UPLOAD FILES FIRST** - Get URLs before backend submission
5. ✅ **ROLE-BASED UI** - Show/hide based on user.rol
6. ✅ **SEPARATION OF CONCERNS** - Clear layer boundaries

## 🎨 UI Features

- Clean, responsive design
- Loading states on all async operations
- Error handling and display
- Form validation
- Modals for create/edit operations
- File upload with progress feedback
- PDF viewer in modal
- Role-based navigation

## 🔄 Data Flow Example

**Creating a Book (Bibliotecario)**
```
1. User clicks "Agregar Libro" in BookManagementView
2. Modal opens with BookFormModal
3. User uploads image → ImageUpload → UploadThing → imageUrl
4. User uploads PDF → PdfUpload → UploadThing → pdfUrl
5. User fills form fields (nombre, autor, descripción, año)
6. User clicks "Crear"
7. BookFormModal calls onSubmit → BookManagementView
8. useBookController.createBook(data) called
9. apiService.createBook(data) sends POST /libros
10. Backend validates, creates book, returns BookViewModel
11. Controller adds book to local state
12. View re-renders with new book in grid
```

## 🎯 Next Steps

The frontend is now fully connected to the backend with proper architecture. To continue:

1. Test login with existing users from backend
2. Test search functionality (will query internal DB + external APIs)
3. Test CRUD operations as bibliotecario
4. Upload images and PDFs to test UploadThing integration
5. Verify role-based access control works correctly

## 🐛 Known Considerations

- External API services (UTL, UNAM, Oxford) have mock URLs - replace with real endpoints when available
- Backend must be running on `http://localhost:3000`
- Database must be running (PostgreSQL on port 11432)
- UploadThing token is configured in both backend and frontend

## 📚 Key Files Reference

- **Main App**: `frontend/App.tsx`
- **API Service**: `frontend/src/services/api.service.ts`
- **Auth Context**: `frontend/src/context/AuthContext.tsx`
- **Architecture Doc**: `frontend/ARCHITECTURE.md`
- **Backend Config**: `backend/src/aplication/config/uploadthing.ts`
- **Backend Routes**: `backend/src/aplication/routes/*.routes.ts`
