import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

/**
 * Oxford/Cambridge API Service
 * 
 * Estructura JSON esperada de la API:
 * {
 *   uuid: string | id: string,
 *   bookTitle: string | titulo: string,
 *   bookCover: string | portadaBase64: string | portadaUrl: string,
 *   pdfUrl: string | pdfBase64: string,
 *   universidad: string,
 *   genre: string | genero: string
 * }
 * 
 * Si necesitas adaptar a una API real, solo cambia los nombres de campos
 * en la función mapExternalBookToInternal()
 */
export class OxfordApiService implements IBookService {
    private baseUrl = "http://192.168.137.1:8079/Cambridge/biblioteca/libro/getAllLibro";

    /**
     * Mapea un libro externo al formato interno
     * SOLO EDITA ESTA FUNCIÓN para adaptar a APIs reales
     */
    private mapExternalBookToInternal(externalBook: any): book {
        // Determinar si usar Base64 o URL para la portada
        const portada = externalBook.portadaBase64 ||
            externalBook.bookCover ||
            externalBook.portadaUrl ||
            externalBook.imageUrl ||
            "";

        // Determinar si usar Base64 o URL para el PDF
        const pdf = externalBook.pdfBase64 ||
            externalBook.pdfUrl ||
            externalBook.pdf ||
            "";

        return {
            id: String(externalBook.uuid || externalBook.id || ""),
            titulo: externalBook.bookTitle || externalBook.titulo || externalBook.title || "",
            portadaBase64: portada,
            pdfBase64: pdf,
            authorName: externalBook.universidad ||
                externalBook.universidadPropietaria ||
                "Oxford/Cambridge",
            genero: externalBook.genre ||
                externalBook.genero ||
                externalBook.generoLiterario ||
                "",
            publishDate: externalBook.publishDate ||
                externalBook.fechaPublicacion ||
                new Date().toISOString().split('T')[0]
        };
    }

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const url = `${this.baseUrl}?q=${encodeURIComponent(title)}`;
            console.log("Buscando en Oxford/Cambridge:", url);

            const response = await fetch(url);

            if (!response.ok) {
                console.error("Error en la API de Oxford/Cambridge:", response.statusText);
                return [];
            }

            const data = await response.json() as any[];

            if (!Array.isArray(data)) {
                console.warn("La respuesta de Oxford/Cambridge no es un array");
                return [];
            }

            const books = data.map(item => this.mapExternalBookToInternal(item));
            console.log(` Oxford/Cambridge retornó ${books.length} libros`);

            return books;
        } catch (error) {
            console.error("Error conectando con API Oxford/Cambridge:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const url = `${this.baseUrl}/${id}`;
            console.log(" Obteniendo libro de Oxford/Cambridge:", url);

            const response = await fetch(url);

            if (!response.ok) {
                console.error(" Libro no encontrado en Oxford/Cambridge");
                return null;
            }

            const item: any = await response.json();

            const book = this.mapExternalBookToInternal(item);
            console.log(" Libro obtenido de Oxford/Cambridge:", book.titulo);

            return book;
        } catch (error) {
            console.error("Error obteniendo libro de Oxford/Cambridge:", error);
            return null;
        }
    }
}
