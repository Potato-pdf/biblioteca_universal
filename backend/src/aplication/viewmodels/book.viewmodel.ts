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
        this.portadaUrl = data.portadaBase64;
        this.pdfUrl = data.pdfBase64;
        this.autor = data.authorName;
        this.descripcion = data.genero;
        this.fechaPublicacion = data.publishDate;
        this.universidad = data.universidad || "𒊑";
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
