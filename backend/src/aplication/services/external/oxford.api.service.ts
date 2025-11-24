import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class OxfordApiService implements IBookService {
    private baseUrl = "https://api-oxford-library.example.com"; // URL ficticia

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(title)}`);

            if (!response.ok) {
                console.error("Error en la API de Oxford:", response.statusText);
                return [];
            }

            const data = await response.json();

            return data.items.map((item: any) => ({
                id: item.id?.toString() || `oxford-${Date.now()}`,
                name: item.title,
                imageUrl: item.cover,
                pdfUrl: item.document,
                authorName: item.author,
                description: item.abstract,
                publishDate: item.year
            }));
        } catch (error) {
            console.error("Error conectando con API Oxford:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const response = await fetch(`${this.baseUrl}/books/${id}`);

            if (!response.ok) {
                return null;
            }

            const item = await response.json();

            return {
                id: item.id?.toString() || id,
                name: item.title,
                imageUrl: item.cover,
                pdfUrl: item.document,
                authorName: item.author,
                description: item.abstract,
                publishDate: item.year
            };
        } catch (error) {
            console.error("Error obteniendo libro de Oxford:", error);
            return null;
        }
    }
}
