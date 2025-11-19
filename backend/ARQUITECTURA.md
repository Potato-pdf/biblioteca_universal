# Estructura del Proyecto - Backend

## 📁 Estructura de Carpetas

```
backend/src/
├── aplication/                     # Capa de Aplicación
│   ├── controllers/                # Controladores (MVC)
│   │   ├── auth.controller.ts      # Login/Logout
│   │   ├── user.controller.ts      # CRUD Usuarios (bibliotecario)
│   │   ├── book.controller.ts      # CRUD Libros (bibliotecario)
│   │   └── search.controller.ts    # Búsqueda (alumno)
│   ├── viewmodels/                 # ViewModels (mapeo datos)
│   │   ├── user.viewmodel.ts
│   │   └── book.viewmodel.ts
│   ├── routes/                     # Rutas API
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── book.routes.ts
│   │   └── search.routes.ts
│   └── services/                   # Servicios DDD
│       └── external/               # ApiServices externos
│           ├── utl.api.service.ts
│           ├── unam.api.service.ts
│           └── oxford.api.service.ts
├── domain/                         # Capa de Dominio
│   ├── models/                     # Modelos (Entidades)
│   │   ├── users/
│   │   │   └── user.model.ts
│   │   └── books/
│   │       └── book.model.ts
│   └── interfaces/                 # Interfaces
│       ├── users/
│       │   ├── user.interface.d.ts
│       │   ├── DAO/
│       │   │   └── user.dao.interface.d.ts
│       │   └── CQRS/
│       │       └── user.cqrs.interface.d.ts
│       ├── books/
│       │   ├── book.interface.d.ts
│       │   ├── DAO/
│       │   │   └── book.dao.interface.d.ts
│       │   └── CQRS/
│       │       └── book.cqrs.interface.d.ts
│       └── external/
│           └── books.external.interface.d.ts
└── infrestructure/                 # Capa de Infraestructura
    ├── database/
    │   └── connecton.db.ts         # Conexión BD
    ├── dao/                        # Data Access Objects
    │   ├── users/
    │   │   └── user.dao.ts
    │   └── books/
    │       └── book.dao.ts
    └── cqrs/                       # Commands (CQRS)
        ├── users/
        │   └── user.cqrs.ts
        └── books/
            └── book.cqrs.ts
```

## 🛣️ Rutas API Disponibles

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión

### Usuarios (Bibliotecario)
- `GET /usuarios` - Listar todos los usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios/guardar` - Crear nuevo usuario
- `PUT /usuarios/editar/:id` - Editar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Libros (Bibliotecario)
- `GET /libros` - Listar todos los libros
- `GET /libros/:id` - Obtener libro por ID
- `POST /libros/guardar` - Crear nuevo libro
- `PUT /libros/editar/:id` - Editar libro
- `DELETE /libros/:id` - Eliminar libro

### Búsqueda (Alumno)
- `GET /buscar?q=termino` - Buscar libros (internos + externos)
- `GET /buscar/:idLibro/:idUni` - Ver detalle de libro específico

## 🏗️ Arquitectura

### Separación de Responsabilidades

1. **Controllers (MVC)**: Reciben requests, coordinan lógica, devuelven responses
2. **DAOs**: Solo consultas y operaciones de BD (NO lógica de negocio)
3. **CQRS**: Solo comandos (crear/editar), validaciones simples
4. **ViewModels**: Solo mapeo de datos (NO lógica)
5. **ApiServices (DDD)**: Solo conexiones externas (NO BD)

### Reglas Clave
- ✅ Controladores → pueden usar DAO y CQRS
- ✅ CQRS → solo llama DAO para persistir
- ✅ ApiServices → solo HTTP externo
- ❌ DAO nunca llama servicios externos
- ❌ CQRS nunca hace consultas
- ❌ ViewModels nunca tienen lógica

## 🚀 Para Iniciar el Servidor

```bash
cd backend
bun run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 🔌 Conectar con Frontend

El frontend debe hacer requests a estas rutas usando fetch/axios:

```typescript
// Ejemplo: Login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Ejemplo: Buscar libros
const response = await fetch('http://localhost:3000/buscar?q=calculo');
const data = await response.json();
```
