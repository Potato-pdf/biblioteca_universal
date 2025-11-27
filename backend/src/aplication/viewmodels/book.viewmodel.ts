import { book } from "../../domain/interfaces/books/book.interface";

export class BookViewModel {
    idLibro: string;
    titulo: string;
    universidad: string;
    portadaUrl: string;
    pdfUrl: string;
    autor: string;
    descripcion: string;
    fechaPublicacion: string;

    constructor(data: {
        id: string;
        titulo: string;
        portadaBase64: string;
        pdfBase64: string;
        authorName: string;
        genero: string;
        publishDate: string;
        universidad?: string;
    }) {
        this.idLibro = data.id;
        this.titulo = data.titulo;
        this.portadaUrl = BookViewModel.ensureBase64Prefix(data.portadaBase64, 'image');
        this.pdfUrl = BookViewModel.ensureBase64Prefix(data.pdfBase64, 'pdf');
        this.autor = data.authorName;
        this.descripcion = data.genero;
        this.fechaPublicacion = data.publishDate;
        this.universidad = data.universidad || "𒊑";
    }

    private static ensureBase64Prefix(base64: string, type: 'image' | 'pdf'): string {
        if (!base64) return "";

        // Si ya tiene el prefijo data:, devolverlo tal cual
        if (base64.startsWith('data:')) {
            return base64;
        }

        // Si es una URL (http/https), devolverla tal cual
        if (base64.startsWith('http://') || base64.startsWith('https://')) {
            return base64;
        }

        // Si no tiene prefijo, agregarlo
        if (type === 'image') {
            // Detectar tipo de imagen (por defecto png)
            return `data:image/png;base64,${base64}`;
        } else {
            return `data:application/pdf;base64,${base64}`;
        }
    }

    static fromInternalBook(book: any): BookViewModel {
        return new BookViewModel({
            id: book.id,
            titulo: book.titulo,
            portadaBase64: book.portadaBase64,
            pdfBase64: book.pdfBase64,
            authorName: book.authorName,
            genero: book.genero,
            publishDate: book.publishDate,
            universidad: "𒊑"
        });
    }

    static fromExternalBook(book: book, universidad: string): BookViewModel {
        return new BookViewModel({
            id: `${universidad}-${book.id}`,
            titulo: book.titulo,
            portadaBase64: book.portadaBase64,
            pdfBase64: book.pdfBase64,
            authorName: book.authorName,
            genero: book.genero,
            publishDate: book.publishDate,
            universidad: universidad
        });
    }
}
