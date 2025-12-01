# 📚 Biblioteca Universal - Documentación de Flujos

## 🎯 Descripción del Proyecto

Plataforma que permite a estudiantes buscar libros de múltiples universidades y visualizar PDFs, combinando:
- **Libros internos** (base de datos local)
- **Libros externos** (APIs de otras universidades)

**Arquitectura:** Clean Architecture con MVC + DAO + CQRS + MVVM + DDD

---

## 📊 Tabla de Contenidos

1. [Flujo 1: Búsqueda Universal de Libros](#flujo-1-búsqueda-universal-de-libros)
2. [Flujo 2: Separación Libros Internos vs Externos](#flujo-2-separación-libros-internos-vs-externos)
3. [Flujo 3: Mostrar Libros Internos](#flujo-3-mostrar-libros-internos)
4. [Flujo 4: Mostrar Libros Externos](#flujo-4-mostrar-libros-externos)
5. [Flujo 5: Transformación a Base64](#flujo-5-transformación-a-base64)
6. [Flujo 6: CRUD Completo de Libros](#flujo-6-crud-completo-de-libros-internos)
7. [Flujo 7: Visualización de PDFs](#flujo-7-visualización-de-pdfs)

---

## 🔍 FLUJO 1: BÚSQUEDA UNIVERSAL DE LIBROS

### Archivos implicados:
- **Frontend:** `BookSearch.tsx`
- **Backend:** `search.controller.ts`
- **Servicios:** `utl.api.service.ts`, `unam.api.service.ts`, `oxford.api.service.ts`
- **DAO:** `book.dao.ts`
- **ViewModel:** `book.viewmodel.ts`

### Diagrama de flujo:

```
┌─────────────────┐
│ 1. USUARIO      │
│ Frontend        │
└────────┬────────┘
         │
         │ 1.1 useEffect() carga inicial
         │ loadAllBooks() → apiService.searchBooks("")
         │
         ▼
┌─────────────────────────────────┐
│ 2. SEARCH CONTROLLER            │
│ buscarLibros(c: Context)        │
└────────┬────────────────────────┘
         │
         │ 2.1 Recibe query (vacío o con texto)
         │
         ├─────────────────────┬──────────────────┬──────────────────┐
         │                     │                  │                  │
         ▼                     ▼                  ▼                  ▼
┌───────────────┐    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 3. BD INTERNA │    │ 4. API UTL   │   │ 5. API UNAM  │   │ 6. API       │
│ BookDAO       │    │ UtlApiService│   │ UnamApiService│   │ OXFORD       │
└───────┬───────┘    └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
        │                   │                   │                   │
        │ getAllLibros()    │ search()          │ getAllBooks()    │ getAllBooks()
        │ o buscarPor       │                   │ + filter         │ + filter
        │ Titulo()          │                   │                   │
        │                   │                   │                   │
        ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 7. TRANSFORMACIÓN A VIEWMODEL                                       │
│ BookViewModel.fromInternalBook(book)                                │
│ BookViewModel.fromExternalBook(book, universidad)                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ 7.1 Unificación de resultados
                               │ [...internos, ...utl, ...unam, ...oxford]
                               │
                               ▼
┌─────────────────────────────────────┐
│ 8. RESPUESTA JSON                   │
│ {                                   │
│   success: true,                    │
│   data: BookViewModel[],            │
│   stats: {                          │
│     internos: 5,                    │
│     externos: {                     │
│       utl: 10,                      │
│       unam: 8,                      │
│       oxford: 12                    │
│     },                              │
│     total: 35                       │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

### Métodos clave:

**SearchController.buscarLibros()**
```typescript
async buscarLibros(c: Context) {
    const filtro = c.req.query("q") || "";
    
    // 1. Buscar en BD interna
    const librosInternos = filtro 
        ? await this.bookDAO.buscarLibrosINternosPorTitulo(filtro)
        : await this.bookDAO.getAllLibrosInternos();
    
    // 2. Buscar en APIs externas (paralelo con manejo individual de errores)
    const [librosUtl, librosUnam, librosOxford] = await Promise.allSettled([...]);
    
    // 3. Transformar a ViewModels
    const viewModelsInternos = librosInternos.map(libro => 
        BookViewModel.fromInternalBook(libro)
    );
    
    // 4. Unificar todos los resultados
    const todosLosLibros = [...viewModelsInternos, ...viewModelsUtl, ...];
    
    return c.json({ success: true, data: todosLosLibros, stats: {...} });
}
```

---

## 🏢 FLUJO 2: SEPARACIÓN LIBROS INTERNOS VS EXTERNOS

### Diferenciación:

#### **Libros INTERNOS:**
```
Origen: PostgreSQL local
DAO: BookDAO
Métodos:
  - getAllLibrosInternos(): Promise<Book[]>
  - getLIbroInternoById(id: string): Promise<Book | null>
  - buscarLibrosINternosPorTitulo(titulo: string): Promise<Book[]>

Transformación:
  BookViewModel.fromInternalBook(book)
  → universidad = "𒊑" (símbolo local)
```

#### **Libros EXTERNOS:**
```
Origen: APIs REST (UTL, UNAM, Oxford)
Servicios: UtlApiService, UnamApiService, OxfordApiService
Métodos:
  - searchExternalBooksByTitle(title: string): Promise<book[]>
  - getExternalBookById(id: string): Promise<book | null>

Transformación:
  BookViewModel.fromExternalBook(book, universidad)
  → universidad = "Universidad Tecnológica de León" | "UNAM" | "Oxford"
```

### Tabla comparativa:

| Característica | Internos | Externos |
|----------------|----------|----------|
| **Fuente** | PostgreSQL local | APIs REST |
| **Disponibilidad** | Siempre disponible | Depende de red/API |
| **Manejo errores** | Error fatal si falla | Continúa con otras fuentes |
| **Universidad** | "𒊑" | Nombre de la universidad |
| **CRUD** | Completo (C, R, U, D) | Solo READ |
| **Timeout** | N/A | 5 segundos |

---

## 📖 FLUJO 3: MOSTRAR LIBROS INTERNOS

### Archivos implicados:
- **Controller:** `book.controller.ts`
- **DAO:** `book.dao.ts`
- **Model:** `book.model.ts`
- **ViewModel:** `book.viewmodel.ts`

### Diagrama de flujo:

```
┌──────────────────┐
│ GET /api/books   │
└────────┬─────────┘
         │
         ▼
┌────────────────────────┐
│ BookController         │
│ listarLibros()         │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ BookDAO                │
│ getAllLibrosInternos() │
└────────┬───────────────┘
         │
         │ TypeORM query
         │
         ▼
┌────────────────────────┐
│ PostgreSQL Database    │
│ SELECT * FROM book     │
└────────┬───────────────┘
         │
         │ Book[] entities
         │
         ▼
┌────────────────────────────────┐
│ BookViewModel.fromInternalBook │
│ Transformación ViewModel       │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Response JSON                  │
│ {                              │
│   success: true,               │
│   data: [                      │
│     {                          │
│       idLibro: "uuid",         │
│       titulo: "...",           │
│       portadaUrl: "data:...",  │
│       pdfUrl: "data:...",      │
│       autor: "...",            │
│       universidad: "𒊑"        │
│     }                          │
│   ]                            │
│ }                              │
└────────────────────────────────┘
```

---

## 🌐 FLUJO 4: MOSTRAR LIBROS EXTERNOS

### Archivos implicados:
- **Services:** `utl.api.service.ts`, `unam.api.service.ts`, `oxford.api.service.ts`
- **Interface:** `books.external.interface.d.ts`
- **ViewModel:** `book.viewmodel.ts`

### Diagrama de flujo (Ejemplo: UnamApiService):

```
┌──────────────────────────────────┐
│ UnamApiService                   │
│ searchExternalBooksByTitle()     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 1. getAllBooks()                 │
│ - Timeout: 5 segundos            │
│ - AbortController                │
└────────┬─────────────────────────┘
         │
         │ HTTP GET
         │ http://192.168.137.11:3003/api/libros
         │
         ▼
┌──────────────────────────────────┐
│ 2. API Externa (UNAM)            │
│ Retorna JSON array               │
└────────┬─────────────────────────┘
         │
         │ [{id, titulo, portadaBase64, ...}, ...]
         │
         ▼
┌──────────────────────────────────┐
│ 3. mapExternalBookToInternal()   │
│ MAPEO DE CAMPOS                  │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 4. Filtrado client-side          │
│ .filter(b => b.titulo.includes() │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 5. Return book[]                 │
└──────────────────────────────────┘
```

### Mapeo de campos externos:

```typescript
private mapExternalBookToInternal(externalBook: any): book {
    return {
        id: String(externalBook.id || externalBook.uuid || `unam-${Date.now()}`),
        titulo: externalBook.titulo || externalBook.title || "",
        portadaBase64: externalBook.portadaBase64 || 
                       externalBook.portadaUrl || "",
        pdfBase64: externalBook.pdfBase64 || 
                   externalBook.pdfUrl || "",
        authorName: externalBook.universidadPropietaria || "UNAM",
        genero: externalBook.generoLiterario || "",
        publishDate: externalBook.publishDate || new Date().toISOString()
    };
}
```

---

## 🔄 FLUJO 5: TRANSFORMACIÓN A BASE64

### Archivos implicados:
- **Frontend:** `BookCRUD.tsx`
- **Método:** `handleFileChange()`

### Diagrama de flujo:

```
┌─────────────────────────┐
│ 1. Usuario selecciona   │
│    archivo (input file) │
└────────┬────────────────┘
         │
         │ onChange event
         │
         ▼
┌─────────────────────────────────┐
│ 2. handleFileChange()           │
│    - Recibe File object         │
│    - Tipo: portada o PDF        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 3. FileReader API               │
│    const reader = new           │
│        FileReader();            │
│    reader.readAsDataURL(file);  │
└────────┬────────────────────────┘
         │
         │ Convierte a Base64
         │
         ▼
┌─────────────────────────────────┐
│ 4. reader.onloadend             │
│    - result: string (Base64)    │
│    - Formato completo:          │
│      "data:image/png;base64,... │
│      "data:application/pdf;...  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 5. Actualizar estado            │
│    setCurrentBook({             │
│      ...prev,                   │
│      [field]: base64String      │
│    })                           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ 6. Vista previa (si es imagen)  │
│    <img src={base64String} />   │
└─────────────────────────────────┘
```

### Código de transformación:

```typescript
const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: 'portadaBase64' | 'pdfBase64'
) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Mantiene el prefijo completo: data:image/png;base64,...
            setCurrentBook(prev => ({ ...prev, [field]: base64String }));
        };
        reader.readAsDataURL(file);
    }
};
```

### Formatos generados:

**Imagen (portada):**
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...
```

**PDF:**
```
data:application/pdf;base64,JVBERi0xLjQKJeLjz9...
```

---

## 💾 FLUJO 6: CRUD COMPLETO DE LIBROS INTERNOS

### CREATE (Crear libro):

```
Frontend (BookCRUD.tsx)
    │
    │ handleSave() → apiService.createBook()
    │
    ▼
BookController.registrarLibro()
    │
    │ 1. Recibe datos del libro con Base64
    │ 2. Crea instancia Book
    │
    ▼
BookCQRS.CreateBook()
    │
    │ 3. Validaciones:
    │    - Campos requeridos
    │    - Formato Base64 válido (regex)
    │    - Longitud género <= 255
    │ 4. Genera UUID
    │ 5. Asigna fecha si no existe
    │
    ▼
BookDAO.insertLibro()
    │
    │ 6. TypeORM save()
    │
    ▼
PostgreSQL
```

### READ (Leer libro):

```
Frontend → GET /api/books/:id
    │
    ▼
BookController.obtenerLibro()
    │
    ▼
BookDAO.getLIbroInternoById()
    │
    ▼
BookViewModel.fromInternalBook()
    │
    ▼
Response JSON
```

### UPDATE (Actualizar libro):

```
Frontend → PUT /api/books/:id
    │
    ▼
BookController.editarLibro()
    │
    ▼
BookCQRS.UpdateBook()
    │
    │ Validaciones parciales
    │
    ▼
BookDAO.updateLibro()
    │
    ▼
PostgreSQL UPDATE
```

### DELETE (Eliminar libro):

```
Frontend → DELETE /api/books/:id
    │
    ▼
BookController.eliminarLibro()
    │
    ▼
BookCQRS.DeleteBook()
    │
    ▼
BookDAO.deleteLibro()
    │
    ▼
PostgreSQL DELETE
```

### Validaciones en BookCQRS.CreateBook():

```typescript
// 1. Campos requeridos
if (!data.titulo || !data.authorName || !data.portadaBase64 || !data.pdfBase64) {
    throw new Error("Datos incompletos");
}

// 2. Validación Base64
const base64Regex = /^data:(image\/(png|jpg|jpeg|gif|webp)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/;
if (!base64Regex.test(data.portadaBase64)) {
    throw new Error("Formato de portada Base64 inválido");
}

// 3. Validación longitud
if (data.genero && data.genero.length > 255) {
    throw new Error("El género no puede exceder 255 caracteres");
}
```

---

## 📊 FLUJO 7: VISUALIZACIÓN DE PDFS

### Archivos implicados:
- `PDFViewer.tsx`

### Diagrama de flujo:

```
┌─────────────────────────┐
│ Usuario hace clic en    │
│ "Leer Libro"            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ PDFViewer component             │
│ Props: { pdfUrl, title }        │
└────────┬────────────────────────┘
         │
         │ 1. Detectar tipo
         │
         ├─────────────────┬────────────────┐
         │                 │                │
         ▼                 ▼                ▼
    Es URL?          Es Base64?     Es Base64 sin prefijo?
    http://...       data:app...     JVBERi0xLjQ...
         │                 │                │
         │                 │                │
         └─────────────────┴────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────┐
│ Normalización:                          │
│ - URL → usar directamente               │
│ - Base64 completo → usar directamente   │
│ - Base64 sin prefijo → agregar prefijo  │
│   "data:application/pdf;base64,"        │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Renderizar en iframe:                   │
│ <iframe src={pdfSrc} />                 │
└─────────────────────────────────────────┘
```

### Código de detección:

```typescript
const isBase64 = !pdfUrl.startsWith('http') && !pdfUrl.startsWith('blob:');

const pdfSrc = isBase64
    ? (pdfUrl.startsWith('data:application/pdf;base64,') 
        ? pdfUrl 
        : `data:application/pdf;base64,${pdfUrl}`)
    : pdfUrl;
```

---

## 📈 ESTADÍSTICAS DEL SISTEMA

El sistema retorna estadísticas en cada búsqueda:

```json
{
  "success": true,
  "data": [...libros...],
  "stats": {
    "internos": 5,
    "externos": {
      "utl": 10,
      "unam": 8,
      "oxford": 12
    },
    "total": 35
  }
}
```

---

## 🏗️ ARQUITECTURA DEL PROYECTO

### Backend (Clean Architecture):

```
backend/src/
├── aplication/
│   ├── controllers/      → MVC (Orquestadores)
│   ├── viewmodels/       → MVVM (Mapeo de datos)
│   └── services/
│       └── external/     → DDD (ApiServices por dominio)
├── domain/
│   ├── models/           → Entidades de negocio
│   └── interfaces/       → Contratos
└── infrestructure/
    ├── dao/              → Solo consultas (SELECT)
    ├── cqrs/             → Solo comandos (INSERT/UPDATE/DELETE)
    └── database/         → Conexión TypeORM
```

### Frontend (React + TypeScript):

```
frontend/src/
├── components/           → 7 pantallas principales
│   ├── Login.tsx
│   ├── LibrarianMenu.tsx
│   ├── StudentMenu.tsx
│   ├── BookCRUD.tsx
│   ├── UserCRUD.tsx
│   ├── BookSearch.tsx
│   └── PDFViewer.tsx
├── services/             → API client
├── viewmodels/           → MVVM (Transformación)
└── context/              → AuthContext (manejo de sesión)
```

---

## 🚀 Ejecución del Proyecto

### Backend:
```bash
cd backend
bun install
bun run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## ✅ RESUMEN EJECUTIVO

**Estado del Proyecto: COMPLETO AL 100%**

| Componente | Patrón | Estado |
|-----------|--------|--------|
| Login | MVC + DAO | ✅ |
| CRUD Usuarios | MVC + DAO + CQRS + MVVM | ✅ |
| CRUD Libros | MVC + DAO + CQRS + MVVM | ✅ |
| Buscador | MVC + DAO + MVVM + DDD | ✅ |
| APIs Externas | DDD (ApiServices) | ✅ |
| Base de Datos | 2 tablas con Base64 | ✅ |
| Frontend | 7 pantallas separadas | ✅ |

**Patrones arquitectónicos estrictamente respetados. Requisitos cumplidos al 100%.**
