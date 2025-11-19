import { Book } from "../../../domain/models/books/book.model";
import { IBookCQRS } from "../../../domain/interfaces/books/CQRS/book.cqrs.interface";
import { BookDAO } from "../../dao/books/book.dao";
import { randomUUID } from "crypto";

export class BookCQRS implements IBookCQRS {
    private bookDAO: BookDAO;

    constructor() {
        this.bookDAO = new BookDAO();
    }

    async CreateBook(data: Book): Promise<boolean> {
        // Validaciones simples
        if (!data.name || !data.authorName || !data.imageUrl || !data.pdfUrl) {
            throw new Error("Datos incompletos para crear libro");
        }

        // Validar que las URLs sean válidas
        try {
            new URL(data.imageUrl);
            new URL(data.pdfUrl);
        } catch {
            throw new Error("URL de imagen o PDF inválida");
        }

        // Validar descripción
        if (data.description && data.description.length > 1000) {
            throw new Error("La descripción no puede exceder 1000 caracteres");
        }

        // Generar ID
        data.id = randomUUID();

        // Si no tiene fecha de publicación, usar la actual
        if (!data.publishDate) {
            data.publishDate = new Date().toISOString().split('T')[0];
        }

        // Llamar al DAO para ejecutar el cambio
        return await this.bookDAO.insertLibro(data);
    }

    async UpdateBook(id: number, data: Book): Promise<boolean> {
        // Validaciones simples
        if (!data.name && !data.authorName && !data.imageUrl && !data.pdfUrl) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Validar URLs si se proporcionan
        if (data.imageUrl) {
            try {
                new URL(data.imageUrl);
            } catch {
                throw new Error("URL de imagen inválida");
            }
        }

        if (data.pdfUrl) {
            try {
                new URL(data.pdfUrl);
            } catch {
                throw new Error("URL de PDF inválida");
            }
        }

        // Validar descripción si se proporciona
        if (data.description && data.description.length > 1000) {
            throw new Error("La descripción no puede exceder 1000 caracteres");
        }

        // Llamar al DAO para ejecutar el cambio
        return await this.bookDAO.updateLibro(id.toString(), data);
    }
}
