import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class UtlApiService implements IBookService {
    private baseUrl = "https://api-utl-books.example.com";

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            // Simulación de llamada HTTP externa
            // En producción, usar fetch o axios
            const response = await fetch(`${this.baseUrl}/books/search?title=${encodeURIComponent(title)}`);

            if (!response.ok) {
                console.error("Error en la API de UTL:", response.statusText);
                return [];
            }

            const data: any = await response.json();

            // Mapear la respuesta al formato interno
            // The user provided JSON is an array: [{ id, titulo, generoLiterario, portadaBase64, universidadPropietaria, pdfBase64 }, ...]
            return Array.isArray(data) ? data.map((externalBook: any) => ({
                id: externalBook.id?.toString() || `utl-${Date.now()}`,
                titulo: externalBook.titulo,
                portadaBase64: externalBook.portadaBase64,
                pdfBase64: externalBook.pdfBase64,
                authorName: externalBook.universidadPropietaria || "UTL",
                genero: externalBook.generoLiterario,
                publishDate: new Date().toISOString() // Default date as it's missing
            })) : [];
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

            const externalBook: any = await response.json();

            // Mapear la respuesta al formato interno
            return {
                id: externalBook.id?.toString() || id,
                titulo: externalBook.titulo,
                portadaBase64: externalBook.portadaBase64,
                pdfBase64: externalBook.pdfBase64,
                authorName: externalBook.universidadPropietaria || "UTL",
                genero: externalBook.generoLiterario,
                publishDate: new Date().toISOString()
            };
        } catch (error) {
            console.error("Error obteniendo libro de UTL:", error);
            return null;
        }
    }
}
