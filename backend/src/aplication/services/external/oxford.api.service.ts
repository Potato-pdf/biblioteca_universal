import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class OxfordApiService implements IBookService {
    private baseUrl = "http://192.168.137.1:8079/Cambridge/biblioteca/libro/getAllLibro";

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const url = `${this.baseUrl}?q=${encodeURIComponent(title)}`;
            console.log("Fetching Oxford URL:", url);
            const response = await fetch(url);

            if (!response.ok) {
                console.error("Error en la API de Oxford:", response.statusText);
                return [];
            }

            const data = await response.json() as any[];

            return data.map((item: any) => ({
                id: item.uuid,
                name: item.bookTitle,
                imageUrl: item.bookCover,
                pdfUrl: item.pdfUrl,
                authorName: item.universidad,
                description: item.genre,
                publishDate: new Date().toISOString().split('T')[0]
            }));
        } catch (error) {
            console.error("Error conectando con API Oxford:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            const url = `${this.baseUrl}/${id}`;
            console.log("Fetching Oxford Detail URL:", url);
            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const item: any = await response.json();

            return {
                id: item.uuid,
                name: item.bookTitle,
                imageUrl: item.bookCover,
                pdfUrl: item.pdfUrl,
                authorName: item.universidad,
                description: item.genre,
                publishDate: new Date().toISOString().split('T')[0]
            };
        } catch (error) {
            console.error("Error obteniendo libro de Oxford:", error);
            return null;
        }
    }
}
