// ViewModels matching backend structure - NO LOGIC, only data structure
export interface BookViewModel {
  id: string;
  nombre: string;
  autor: string;
  descripcion: string;
  imageUrl: string;
  pdfUrl: string;
  universidad: string;
  añoPublicacion: number;
}

export interface CreateBookDTO {
  nombre: string;
  autor: string;
  descripcion: string;
  imageUrl: string;
  pdfUrl: string;
  añoPublicacion: number;
}

export interface UpdateBookDTO {
  nombre?: string;
  autor?: string;
  descripcion?: string;
  imageUrl?: string;
  pdfUrl?: string;
  añoPublicacion?: number;
}

export interface SearchBooksResponse {
  total: number;
  libros: BookViewModel[];
}
