import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class OxfordApiService implements IBookService {
    private baseUrl = "http://192.168.137.1:8079/Cambridge/biblioteca/libro/getAllLibro";

    /**
     * Mapea un libro externo al formato interno
     */
    private mapExternalBookToInternal(externalBook: any): book {
        return {
            id: String(externalBook.uuid || externalBook.id || ""),
            titulo: externalBook.bookTitle || externalBook.titulo || "",
            portadaBase64: externalBook.bookCover || externalBook.portadaBase64 || "",
            pdfBase64: externalBook.pdfUrl || externalBook.pdfBase64 || "",
            authorName: externalBook.universidad || "Cambridge",
            genero: externalBook.genre || externalBook.genero || "",
            publishDate: new Date().toISOString().split('T')[0] // Default date as not provided in example
        };
    }

    async getAllBooks(): Promise<book[]> {
        try {
            console.log("Obteniendo libros de Cambridge:", this.baseUrl);

            // Add 5-second timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(this.baseUrl, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error("Error en la API de Cambridge:", response.statusText);
                return [];
            }

            const data = await response.json() as any[];

            if (!Array.isArray(data)) {
                console.warn("La respuesta de Cambridge no es un array");
                return [];
            }

            const books = data.map(item => this.mapExternalBookToInternal(item));
            console.log(`Cambridge retornó ${books.length} libros`);

            return books;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error("Timeout conectando con API Cambridge (5s)");
            } else {
                console.error("Error conectando con API Cambridge:", error);
            }
            return [];
        }
    }

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        // Since the URL provided is for getAll, we might need to filter manually or check if there is a search endpoint.
        // For now, let's fetch all and filter, or just return empty if search is not supported by this specific URL.
        // Assuming we can filter client-side for now as the URL is specific.
        try {
            const allBooks = await this.getAllBooks();
            return allBooks.filter(b => b.titulo.toLowerCase().includes(title.toLowerCase()));
        } catch (error) {
            console.error("Error searching in Cambridge:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        // Similarly, if there is no specific ID endpoint, we might need to fetch all and find.
        try {
            const allBooks = await this.getAllBooks();
            return allBooks.find(b => b.id === id) || null;
        } catch (error) {
            console.error("Error getting book by ID from Cambridge:", error);
            return null;
        }
    }
}
