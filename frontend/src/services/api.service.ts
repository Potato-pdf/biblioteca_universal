import type { BookViewModel } from '../viewmodels/book.viewmodel';
import type { UserViewModel } from '../viewmodels/user.viewmodel';
import type { LoginRequest, LoginResponse } from '../viewmodels/auth.viewmodel';

const API_BASE_URL = 'http://localhost:3000'; // Puerto del backend Hono

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Helper para hacer requests
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // === AUTH ===
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    // === BOOKS ===
    // El backend decide si busca internos o externos
    async searchBooks(query: string): Promise<{ success: boolean; data: BookViewModel[] }> {
        return this.request(`/buscar?q=${encodeURIComponent(query)}`);
    }

    async getAllBooks(): Promise<{ success: boolean; data: BookViewModel[] }> {
        return this.request('/libros');
    }

    async getBookById(id: string): Promise<{ success: boolean; data: BookViewModel }> {
        return this.request(`/libros/${id}`);
    }

    async createBook(formData: FormData): Promise<{ success: boolean; data: BookViewModel }> {
        // Para FormData, no enviamos Content-Type, el navegador lo maneja
        const url = `${this.baseUrl}/libros/guardar`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData, // FormData incluye archivos (PDF, imagen)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async updateBook(id: string, formData: FormData): Promise<{ success: boolean; data: BookViewModel }> {
        const url = `${this.baseUrl}/libros/editar/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async deleteBook(id: string): Promise<{ success: boolean }> {
        return this.request(`/libros/${id}`, {
            method: 'DELETE',
        });
    }

    // === USERS ===
    async getAllUsers(): Promise<{ success: boolean; data: UserViewModel[] }> {
        return this.request('/usuarios');
    }

    async createUser(userData: { nombre: string; email: string; password: string; rol: string }): Promise<{ success: boolean; data: UserViewModel }> {
        return this.request('/usuarios/guardar', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async updateUser(id: string, userData: Partial<{ nombre: string; email: string; password?: string; rol: string }>): Promise<{ success: boolean; data: UserViewModel }> {
        return this.request(`/usuarios/editar/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id: string): Promise<{ success: boolean }> {
        return this.request(`/usuarios/${id}`, {
            method: 'DELETE',
        });
    }
}

// Singleton
export const apiService = new ApiService();
