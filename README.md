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


