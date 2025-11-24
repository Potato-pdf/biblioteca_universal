const API_URL = 'http://localhost:3000';

export interface User {
    id?: number;
    name: string;
    email: string;
    rol: 'bibliotecario' | 'alumno';
    password?: string;
}

export interface Book {
    id?: number;
    name: string;
    authorName: string;
    imageUrl: string;
    pdfUrl: string;
    description?: string;
    publishDate?: string;
    university?: string;
}

export const apiService = {
    // Auth
    login: async (credentials: { email: string, password: string }) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    // Users
    getAllUsers: async () => {
        const response = await fetch(`${API_URL}/usuarios`);
        return response.json();
    },

    createUser: async (user: any) => {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    updateUser: async (id: string, user: any) => {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return response.json();
    },

    deleteUser: async (id: string) => {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Books
    getAllBooks: async () => {
        const response = await fetch(`${API_URL}/libros`);
        return response.json();
    },

    createBook: async (book: any) => {
        const response = await fetch(`${API_URL}/libros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book),
        });
        return response.json();
    },

    updateBook: async (id: string, book: any) => {
        const response = await fetch(`${API_URL}/libros/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book),
        });
        return response.json();
    },

    deleteBook: async (id: string) => {
        const response = await fetch(`${API_URL}/libros/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Search
    searchBooks: async (query: string) => {
        const response = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(query)}`);
        return response.json();
    }
};
