// API Service - Handles ALL communication with backend
// NO BUSINESS LOGIC - only HTTP calls
import type {
  UserViewModel,
  CreateUserDTO,
  UpdateUserDTO,
  LoginCredentials,
  LoginResponse,
} from "../viewmodels/user.viewmodel";
import type {
  BookViewModel,
  CreateBookDTO,
  UpdateBookDTO,
  SearchBooksResponse,
} from "../viewmodels/book.viewmodel";

const API_BASE_URL = "http://localhost:3000";

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private setAuthToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Error en la petición",
      }));
      throw new Error(error.message || `HTTP Error ${response.status}`);
    }

    return response.json();
  }

  // ========== AUTH ENDPOINTS ==========
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    // Store user info in localStorage for role-based UI
    localStorage.setItem("currentUser", JSON.stringify(response.user));
    return response;
  }

  async logout(): Promise<void> {
    await this.request<void>("/auth/logout", { method: "POST" });
    this.removeAuthToken();
    localStorage.removeItem("currentUser");
  }

  getCurrentUser(): UserViewModel | null {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  }

  // ========== USER ENDPOINTS ==========
  async getAllUsers(): Promise<UserViewModel[]> {
    return this.request<UserViewModel[]>("/usuarios");
  }

  async getUserById(id: string): Promise<UserViewModel> {
    return this.request<UserViewModel>(`/usuarios/${id}`);
  }

  async createUser(userData: CreateUserDTO): Promise<UserViewModel> {
    return this.request<UserViewModel>("/usuarios", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: string,
    userData: UpdateUserDTO
  ): Promise<UserViewModel> {
    return this.request<UserViewModel>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/usuarios/${id}`, { method: "DELETE" });
  }

  // ========== BOOK ENDPOINTS ==========
  async getAllBooks(): Promise<BookViewModel[]> {
    return this.request<BookViewModel[]>("/libros");
  }

  async getBookById(id: string): Promise<BookViewModel> {
    return this.request<BookViewModel>(`/libros/${id}`);
  }

  async createBook(bookData: CreateBookDTO): Promise<BookViewModel> {
    return this.request<BookViewModel>("/libros", {
      method: "POST",
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(
    id: string,
    bookData: UpdateBookDTO
  ): Promise<BookViewModel> {
    return this.request<BookViewModel>(`/libros/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string): Promise<void> {
    return this.request<void>(`/libros/${id}`, { method: "DELETE" });
  }

  // ========== SEARCH ENDPOINTS ==========
  async searchBooks(titulo: string): Promise<SearchBooksResponse> {
    const params = new URLSearchParams({ titulo });
    return this.request<SearchBooksResponse>(`/buscar/libros?${params}`);
  }

  async viewBook(
    id: string,
    universidad?: string
  ): Promise<BookViewModel> {
    const params = new URLSearchParams({ id });
    if (universidad) {
      params.append("universidad", universidad);
    }
    return this.request<BookViewModel>(`/buscar/libro?${params}`);
  }
}

// Singleton instance
export const apiService = new ApiService();
