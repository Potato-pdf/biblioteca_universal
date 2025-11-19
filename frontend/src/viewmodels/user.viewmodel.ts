// ViewModel que coincide EXACTAMENTE con el backend
// El frontend NUNCA construye estos modelos, solo los recibe del backend
export interface UserViewModel {
    id: string;
    nombre: string;
    email: string;
    rol: string; // 'bibliotecario' | 'alumno'
}
