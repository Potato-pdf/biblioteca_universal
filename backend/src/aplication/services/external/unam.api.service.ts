import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class UnamApiService implements IBookService {
    private baseUrl = "https://api-unam-biblioteca.example.com"; // URL ficticia

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const response = await fetch(`${this.baseUrl}/libros?busqueda=${encodeURIComponent(title)}`);

            if (!response.ok) {
                console.error("Error en la API de UNAM:", response.statusText);
                return [];
            }

            const data : any = await response.json();

            return data.resultados.map((libro: any) => ({
                id: libro.id?.toString() || `unam-${Date.now()}`,
                name: libro.nombre,
                imageUrl: libro.imagen,
                pdfUrl: libro.pdf,
                authorName: libro.escritor,
                description: libro.descripcion,
                publishDate: libro.fecha
            }));
        } catch (error) {
            console.error("Error conectando con API UNAM:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const response = await fetch(`${this.baseUrl}/libros/${id}`);

            if (!response.ok) {
                return null;
            }

            const libro : any= await response.json();

            return {
                id: libro.id?.toString() || id,
                name: libro.nombre,
                imageUrl: libro.imagen,
                pdfUrl: libro.pdf,
                authorName: libro.escritor,
                description: libro.descripcion,
                publishDate: libro.fecha
            };
        } catch (error) {
            console.error("Error obteniendo libro de UNAM:", error);
            return null;
        }
    }
}
