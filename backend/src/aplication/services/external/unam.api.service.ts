import { book } from "../../../domain/interfaces/books/book.interface";
import { IBookService } from "../../../domain/interfaces/external/books.external.interface";

export class UnamApiService implements IBookService {
    private baseUrl = "http://192.168.137.11:3003/api/libros";

    async searchExternalBooksByTitle(title: string): Promise<book[]> {
        try {
            const url = `${this.baseUrl}?busqueda=${encodeURIComponent(title)}`;
            console.log("Fetching UNAM URL:", url);
            const response = await fetch(url);

            if (!response.ok) {
                console.error("Error en la API de UNAM:", response.statusText);
                return [];
            }

            const data = await response.json() as any[];

            return data.map((libro: any) => ({
                id: libro.id,
                name: libro.titulo,
                imageUrl: libro.portadaBase64,
                pdfUrl: libro.pdfBase64,
                authorName: libro.universidadPropietaria,
                description: libro.generoLiterario,
                publishDate: new Date().toISOString().split('T')[0] // Fecha por defecto
            }));
        } catch (error) {
            console.error("Error conectando con API UNAM:", error);
            return [];
        }
    }

    async getExternalBookById(id: string): Promise<book | null> {
        try {
            // Assuming the ID endpoint is different or we append ID to base?
            // If baseUrl is .../getAllLibro, maybe detail is .../getLibro?id=... or .../getAllLibro/id?
            // Let's try appending the ID directly if it's a RESTful style, or use a query param if RPC style.
            // Given the previous code used /libros/id, maybe it was .../getAllLibro/id ?
            // Let's try:
            const url = `${this.baseUrl}/${id}`;
            console.log("Fetching UNAM Detail URL:", url);
            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const libro: any = await response.json();
            // Asumiendo que el endpoint de detalle devuelve el mismo formato o es parte de la lista
            // Si el endpoint devuelve un solo objeto:
            return {
                id: libro.id,
                name: libro.titulo,
                imageUrl: libro.portadaBase64,
                pdfUrl: libro.pdfBase64,
                authorName: libro.universidadPropietaria,
                description: libro.generoLiterario,
                publishDate: new Date().toISOString().split('T')[0]
            };
        } catch (error) {
            console.error("Error obteniendo libro de UNAM:", error);
            return null;
        }
    }
}
