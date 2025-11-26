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
        if (!data.titulo || !data.authorName || !data.portadaBase64 || !data.pdfBase64) {
            throw new Error("Datos incompletos para crear libro");
        }

        // Validar que sean cadenas Base64 válidas
        const base64Regex = /^data:(image\/(png|jpg|jpeg|gif|webp)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/;
        if (!base64Regex.test(data.portadaBase64)) {
            throw new Error("Formato de portada Base64 inválido");
        }
        if (!base64Regex.test(data.pdfBase64)) {
            throw new Error("Formato de PDF Base64 inválido");
        }

        // Validar género
        if (data.genero && data.genero.length > 255) {
            throw new Error("El género no puede exceder 255 caracteres");
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

    async UpdateBook(id: string, data: Book): Promise<boolean> {
        // Validaciones simples
        if (!data.titulo && !data.authorName && !data.portadaBase64 && !data.pdfBase64) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Validar Base64 si se proporcionan
        const base64Regex = /^data:(image\/(png|jpg|jpeg|gif|webp)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/;

        if (data.portadaBase64) {
            if (!base64Regex.test(data.portadaBase64)) {
                throw new Error("Formato de portada Base64 inválido");
            }
        }

        if (data.pdfBase64) {
            if (!base64Regex.test(data.pdfBase64)) {
                throw new Error("Formato de PDF Base64 inválido");
            }
        }

        // Validar género si se proporciona
        if (data.genero && data.genero.length > 255) {
            throw new Error("El género no puede exceder 255 caracteres");
        }

        // Llamar al DAO para ejecutar el cambio
        return await this.bookDAO.updateLibro(id, data);
    }

    async DeleteBook(id: string): Promise<boolean> {
        return await this.bookDAO.deleteLibro(id);
    }
}
