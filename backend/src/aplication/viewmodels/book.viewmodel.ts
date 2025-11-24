import { book } from "../../../domain/interfaces/books/book.interface";

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
        name: string;
        imageUrl: string;
        pdfUrl: string;
        authorName: string;
        description: string;
        publishDate: string;
        universidad?: string;
    }) {
        this.idLibro = data.id;
        this.titulo = data.name;
        this.portadaUrl = data.imageUrl;
        this.pdfUrl = data.pdfUrl;
        this.autor = data.authorName;
        this.descripcion = data.description;
        this.fechaPublicacion = data.publishDate;
        this.universidad = data.universidad || "Biblioteca Universidad Gustambo";
    }

    static fromInternalBook(book: any): BookViewModel {
        return new BookViewModel({
            id: book.id,
            name: book.name,
            imageUrl: book.imageUrl,
            pdfUrl: book.pdfUrl,
            authorName: book.authorName,
            description: book.description,
            publishDate: book.publishDate,
            universidad: "Biblioteca Universidad Gustambo"
        });
    }

    static fromExternalBook(book: book, universidad: string): BookViewModel {
        return new BookViewModel({
            id: book.id,
            name: book.name,
            imageUrl: book.imageUrl,
            pdfUrl: book.pdfUrl,
            authorName: book.authorName,
            description: book.description,
            publishDate: book.publishDate,
            universidad: universidad
        });
    }
}
