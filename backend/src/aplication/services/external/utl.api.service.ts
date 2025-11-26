import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

/**
 * UTL (Universidad Tecnológica de León) API Service
 * 
 * Estructura JSON esperada de la API:
 * {
 *   id: string | number,
*   titulo: string,
 *   portadaBase64?: string,      // Base64 de la imagen
 *   portadaUrl?: string,         // O URL de la imagen
 *   pdfBase64?: string,          // Base64 del PDF
 *   pdfUrl?: string,             // O URL del PDF
 *   universidadPropietaria: string,
 *   generoLiterario: string
 * }
 * 
 * Si necesitas adaptar a una API real, solo cambia los nombres de campos
 * en la función mapExternalBookToInternal()
 */
export class UtlApiService implements IBookService {
    private baseUrl = "https://api-utl-books.example.com";

    /**
     * Mapea un libro externo al formato interno
     * SOLO EDITA ESTA FUNCIÓN para adaptar a APIs reales
     */
    private mapExternalBookToInternal(externalBook: any): book {
        // Determinar si usar Base64 o URL para la portada
        const portada = externalBook.portadaBase64 ||
            externalBook.portadaUrl ||
            externalBook.imageUrl ||
            "";

        // Determinar si usar Base64 o URL para el PDF
        const pdf = externalBook.pdfBase64 ||
            externalBook.pdfUrl ||
            externalBook.pdf ||
            "";

        return {
            id: String(externalBook.id || externalBook.uuid || `utl-${Date.now()}`),
            titulo: externalBook.titulo || externalBook.title || "",
            portadaBase64: portada,
            pdfBase64: pdf,
            authorName: externalBook.universidadPropietaria ||
                externalBook.universidad ||
                "UTL",
            genero: externalBook.generoLiterario ||
                externalBook.genero ||
                externalBook.genre ||
                "",
            publishDate: externalBook.publishDate ||
                externalBook.fechaPublicacion ||
                new Date().toISOString()
        };
    }

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const url = `${this.baseUrl}/books/search?title=${encodeURIComponent(title)}`;
            console.log(" Buscando en UTL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                console.error("Error en la API de UTL:", response.statusText);
                return [];
            }

            const data: any = await response.json();

            if (!Array.isArray(data)) {
                console.warn("La respuesta de UTL no es un array");
                return [];
            }

            const books = data.map(externalBook => this.mapExternalBookToInternal(externalBook));
            console.log(` UTL retornó ${books.length} libros`);

            return books;
        } catch (error) {
            console.error("Error conectando con API UTL:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const url = `${this.baseUrl}/books/${id}`;
            console.log(" Obteniendo libro de UTL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                console.error("Libro no encontrado en UTL");
                return null;
            }

            const externalBook: any = await response.json();

            const book = this.mapExternalBookToInternal(externalBook);
            console.log("Libro obtenido de UTL:", book.titulo);

            return book;
        } catch (error) {
            console.error("Error obteniendo libro de UTL:", error);
            return null;
        }
    }
}
