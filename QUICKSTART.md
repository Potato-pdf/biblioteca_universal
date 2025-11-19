# 🚀 Quick Start Guide - Biblioteca Universal

## Prerequisites
- Bun installed (for backend)
- Node.js and npm installed (for frontend)
- PostgreSQL running on localhost:11432
- Docker (optional, if using docker-compose for PostgreSQL)

## 1. Start the Database

If using docker-compose:
```bash
docker-compose up -d
```

## 2. Start the Backend

```bash
cd backend
bun install  # if not already installed
bun run src/index.ts
```

Backend will start on `http://localhost:3000`

**Backend provides:**
- Authentication endpoints (`/auth/login`, `/auth/logout`)
- User CRUD endpoints (`/usuarios/*`)
- Book CRUD endpoints (`/libros/*`)
- Search endpoints (`/buscar/*` - searches internal + external APIs)
- UploadThing file upload endpoint (`/api/uploadthing`)

## 3. Start the Frontend

Open a new terminal:
```bash
cd frontend
npm install  # if not already installed
npm run dev
```

Frontend will start on `http://localhost:5173`

## 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

### Test Users

You'll need to create users via the backend or database first. Example SQL:

```sql
INSERT INTO users (id, nombre, email, password, rol) VALUES
('uuid-here', 'Admin', 'admin@biblioteca.com', 'hashed-password', 'bibliotecario'),
('uuid-here-2', 'Alumno Test', 'alumno@biblioteca.com', 'hashed-password', 'alumno');
```

**Note:** Passwords must be hashed using Bun.password.hash() in the backend.

Or use the backend to create users:
```bash
# POST http://localhost:3000/usuarios
# Body: {"nombre": "Test", "email": "test@test.com", "password": "123456", "rol": "alumno"}
```

## 5. Login

Use the credentials you created:
- Email: `admin@biblioteca.com`
- Password: (the one you set)

## 6. Features by Role

### As Alumno (Student)
- ✅ Search books across internal DB and external APIs
- ✅ View book details with PDF viewer
- ❌ Cannot create, edit, or delete books
- ❌ Cannot manage users

### As Bibliotecario (Librarian)
- ✅ All Alumno features
- ✅ Create, edit, delete books
- ✅ Upload book covers and PDFs via UploadThing
- ✅ Manage users (create, edit, delete)

## 7. Testing the Integration

### Search Functionality
1. Login as any user
2. Type a book title in the search box
3. Backend will search:
   - Internal PostgreSQL database
   - UTL external API (currently mock)
   - UNAM external API (currently mock)
   - Oxford external API (currently mock)
4. Results are unified and displayed

### Create a Book (Bibliotecario only)
1. Login as bibliotecario
2. Click "Libros" tab
3. Click "+ Agregar Libro"
4. Upload an image (max 4MB)
5. Upload a PDF (max 16MB)
6. Fill in the form
7. Click "Crear"
8. Book appears in the grid

### Upload Flow
1. File is uploaded to UploadThing cloud storage
2. UploadThing returns a URL
3. URL is sent to backend in the book creation request
4. Backend stores the URL in PostgreSQL
5. When viewing, frontend loads image/PDF from UploadThing URL

## 8. Project Structure

```
biblioteca_universal/
├── backend/
│   ├── src/
│   │   ├── index.ts                           # Main server
│   │   ├── domain/models/                     # TypeORM entities
│   │   ├── infrestructure/
│   │   │   ├── database/                      # DB connection
│   │   │   ├── dao/                           # Data Access Objects
│   │   │   └── cqrs/                          # Commands with validation
│   │   └── aplication/
│   │       ├── controllers/                   # Request handlers
│   │       ├── viewmodels/                    # Response mapping
│   │       ├── services/external/             # External APIs
│   │       ├── routes/                        # Route definitions
│   │       └── config/                        # UploadThing config
│   └── .env                                   # Backend environment
└── frontend/
    ├── src/
    │   ├── context/                           # React Context
    │   ├── controllers/                       # State management
    │   ├── services/                          # API calls
    │   ├── viewmodels/                        # TypeScript interfaces
    │   ├── views/                             # React components
    │   └── hooks/                             # Custom hooks
    ├── App.tsx                                # Main app with routing
    ├── .env                                   # Frontend environment
    └── ARCHITECTURE.md                        # Architecture docs
```

## 9. Environment Variables

### Backend `.env`
```env
UPLOADTHING_TOKEN='eyJhcGlL...'
```

### Frontend `.env`
```env
VITE_UPLOADTHING_TOKEN=eyJhcGlL...
VITE_API_URL=http://localhost:3000
```

## 10. Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database connection in `backend/src/infrestructure/database/connecton.db.ts`
- Check port 3000 is not in use

### Frontend won't connect
- Verify backend is running on port 3000
- Check CORS is enabled in backend
- Open browser console for error messages

### Uploads fail
- Verify UploadThing token is correct in both `.env` files
- Check network tab in browser dev tools
- Verify file size limits (4MB for images, 16MB for PDFs)

### TypeORM errors
- Ensure `reflect-metadata` is imported first in `index.ts`
- Check `experimentalDecorators` and `emitDecoratorMetadata` in `tsconfig.json`

## 11. Architecture Highlights

✅ **Strict MVC/MVVM Pattern**
- Controllers: State management only
- Views: UI rendering only
- ViewModels: Data structures only
- Services: HTTP calls only

✅ **Backend as Source of Truth**
- Frontend uses backend ViewModels directly
- No frontend-specific data modeling

✅ **Role-Based Access Control**
- UI adapts based on user.rol
- Backend validates permissions

✅ **File Upload Best Practices**
- Files uploaded to UploadThing first
- Only URLs stored in database
- No binary data in PostgreSQL

## 12. Next Development Steps

1. Replace mock URLs in external API services with real endpoints
2. Implement proper authentication tokens (JWT)
3. Add pagination for large result sets
4. Implement caching for external API results
5. Add unit tests for controllers
6. Add E2E tests for critical flows
7. Implement forgot password functionality
8. Add email notifications for new books
9. Implement book reservations/loans system
10. Add analytics dashboard for bibliotecarios

## 📚 Documentation Files

- `frontend/ARCHITECTURE.md` - Complete architecture explanation
- `frontend/INTEGRATION_SUMMARY.md` - What was built and how it works
- `frontend/README.md` - Frontend-specific instructions
- `backend/README.md` - Backend-specific instructions

Enjoy your fully integrated biblioteca universal! 🎉
