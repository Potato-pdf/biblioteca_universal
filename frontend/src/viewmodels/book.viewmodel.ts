// ViewModel que coincide EXACTAMENTE con el backend
// El frontend NUNCA construye estos modelos, solo los recibe del backend
export interface BookViewModel {
    idLibro: string;
    titulo: string;
    universidad: string;
    portadaUrl: string;
    pdfUrl: string;
    autor: string;
    descripcion: string;
    fechaPublicacion: string;
}
