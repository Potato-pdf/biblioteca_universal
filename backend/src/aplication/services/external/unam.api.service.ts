import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

/**
 * UNAM API Service
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
export class UnamApiService implements IBookService {
    private baseUrl = "http://192.168.137.11:3003/api/libros";

    /**
     * Mapea un libro externo al formato interno
     */
    private mapExternalBookToInternal(externalBook: any): book {
        return {
            id: String(externalBook.id || externalBook.uuid || ""),
            titulo: externalBook.titulo || externalBook.title || "",
            portadaBase64: externalBook.portadaBase64 || externalBook.portadaUrl || "",
            pdfBase64: externalBook.pdfBase64 || externalBook.pdfUrl || "",
            authorName: externalBook.universidadPropietaria || externalBook.universidad || "UNAM",
            genero: externalBook.generoLiterario || externalBook.genero || "",
            publishDate: externalBook.fechaPublicacion || new Date().toISOString().split('T')[0]
        };
    }

    async getAllBooks(): Promise<book[]> {
        try {
            console.log("Obteniendo libros de UNAM:", this.baseUrl);

            // Add 5-second timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(this.baseUrl, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error("Error en la API de UNAM:", response.statusText);
                return [];
            }

            const data = await response.json() as any[];

            if (!Array.isArray(data)) {
                console.warn("La respuesta de UNAM no es un array");
                return [];
            }

            const books = data.map(libro => this.mapExternalBookToInternal(libro));
            console.log(`UNAM retornó ${books.length} libros`);

            return books;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error("Timeout conectando con API UNAM (5s)");
            } else {
                console.error("Error conectando con API UNAM:", error);
            }
            return [];
        }
    }

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const allBooks = await this.getAllBooks();
            return allBooks.filter(b => b.titulo.toLowerCase().includes(title.toLowerCase()));
        } catch (error) {
            console.error("Error conectando con API UNAM:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const allBooks = await this.getAllBooks();
            return allBooks.find(b => b.id === id) || null;
        } catch (error) {
            console.error("Error obteniendo libro de UNAM:", error);
            return null;
        }
    }
}
