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
            id: String(externalBook.id || externalBook.uuid || ""),
            titulo: externalBook.titulo || externalBook.title || "",
            portadaBase64: portada,
            pdfBase64: pdf,
            authorName: externalBook.universidadPropietaria ||
                externalBook.universidad ||
                "UNAM",
            genero: externalBook.generoLiterario ||
                externalBook.genero ||
                externalBook.genre ||
                "",
            publishDate: externalBook.publishDate ||
                externalBook.fechaPublicacion ||
                new Date().toISOString().split('T')[0]
        };
    }

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const url = `${this.baseUrl}?busqueda=${encodeURIComponent(title)}`;
            console.log(" Buscando en UNAM:", url);

            const response = await fetch(url);

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
        } catch (error) {
            console.error("Error conectando con API UNAM:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const url = `${this.baseUrl}/${id}`;
            console.log(" Obteniendo libro de UNAM:", url);

            const response = await fetch(url);

            if (!response.ok) {
                console.error("Libro no encontrado en UNAM");
                return null;
            }

            const libro: any = await response.json();

            const book = this.mapExternalBookToInternal(libro);
            console.log("Libro obtenido de UNAM:", book.titulo);

            return book;
        } catch (error) {
            console.error("Error obteniendo libro de UNAM:", error);
            return null;
        }
    }
}
