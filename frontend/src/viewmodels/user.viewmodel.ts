// ViewModels matching backend structure - NO LOGIC, only data structure
export interface UserViewModel {
  id: string;
  nombre: string;
  email: string;
  rol: "bibliotecario" | "alumno";
}

export interface CreateUserDTO {
  nombre: string;
  email: string;
  password: string;
  rol: "bibliotecario" | "alumno";
}

export interface UpdateUserDTO {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: "bibliotecario" | "alumno";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: UserViewModel;
}
