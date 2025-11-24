import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class UtlApiService implements IBookService {
    private baseUrl = "https://api-utl-books.example.com"; // URL ficticia

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            // Simulación de llamada HTTP externa
            // En producción, usar fetch o axios
            const response = await fetch(`${this.baseUrl}/books/search?title=${encodeURIComponent(title)}`);

            if (!response.ok) {
                console.error("Error en la API de UTL:", response.statusText);
                return [];
            }

            const data = await response.json();

            // Mapear la respuesta al formato interno
            return data.books.map((externalBook: any) => ({
                id: externalBook.id?.toString() || `utl-${Date.now()}`,
                name: externalBook.titulo,
                imageUrl: externalBook.portada,
                pdfUrl: externalBook.documento,
                authorName: externalBook.autor,
                description: externalBook.resumen,
                publishDate: externalBook.anio
            }));
        } catch (error) {
            console.error("Error conectando con API UTL:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const response = await fetch(`${this.baseUrl}/books/${id}`);

            if (!response.ok) {
                return null;
            }

            const externalBook = await response.json();

            // Mapear la respuesta al formato interno
            return {
                id: externalBook.id?.toString() || id,
                name: externalBook.titulo,
                imageUrl: externalBook.portada,
                pdfUrl: externalBook.documento,
                authorName: externalBook.autor,
                description: externalBook.resumen,
                publishDate: externalBook.anio
            };
        } catch (error) {
            console.error("Error obteniendo libro de UTL:", error);
            return null;
        }
    }
}
