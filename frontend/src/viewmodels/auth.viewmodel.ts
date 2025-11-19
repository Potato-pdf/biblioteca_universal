// ViewModels para autenticación
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        nombre: string;
        email: string;
        rol: string;
    };
    token?: string;
}
