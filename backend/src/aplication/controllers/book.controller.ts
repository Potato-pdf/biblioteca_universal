import { Context } from "hono";
import { BookDAO } from "../../infrestructure/dao/books/book.dao";
import { BookCQRS } from "../../infrestructure/cqrs/books/book.cqrs";
import { BookViewModel } from "../viewmodels/book.viewmodel";
import { Book } from "../../domain/models/books/book.model";

export class BookController {
    private bookDAO: BookDAO;
    private bookCQRS: BookCQRS;

    constructor() {
        this.bookDAO = new BookDAO();
        this.bookCQRS = new BookCQRS();
    }

    async listarLibros(c: Context) {
        try {
            const books = await this.bookDAO.getAllLibrosInternos();
            const viewModels = books.map(book => BookViewModel.fromInternalBook(book));
            return c.json({ success: true, data: viewModels });
        } catch (error) {
            console.error("Error listando libros:", error);
            return c.json({ error: "Error al obtener libros" }, 500);
        }
    }

    async obtenerLibro(c: Context) {
        try {
            const id = parseInt(c.req.param("id"));
            const book = await this.bookDAO.getLIbroInternoById(id);

            if (!book) {
                return c.json({ error: "Libro no encontrado" }, 404);
            }

            const viewModel = BookViewModel.fromInternalBook(book);
            return c.json({ success: true, data: viewModel });
        } catch (error) {
            console.error("Error obteniendo libro:", error);
            return c.json({ error: "Error al obtener libro" }, 500);
        }
    }

    async registrarLibro(c: Context) {
        try {
            const data = await c.req.json();

            const book = new Book();
            book.name = data.name;
            book.authorName = data.authorName;
            book.imageUrl = data.imageUrl;
            book.pdfUrl = data.pdfUrl;
            book.description = data.description || "";
            book.publishDate = data.publishDate || new Date().toISOString().split('T')[0];

            const success = await this.bookCQRS.CreateBook(book);

            if (success) {
                return c.json({ success: true, message: "Libro registrado exitosamente" }, 201);
            } else {
                return c.json({ error: "No se pudo registrar el libro" }, 500);
            }
        } catch (error: any) {
            console.error("Error registrando libro:", error);
            return c.json({ error: error.message || "Error al registrar libro" }, 400);
        }
    }

    async editarLibro(c: Context) {
        try {
            const id = parseInt(c.req.param("id"));
            const data = await c.req.json();

            const book = new Book();
            if (data.name) book.name = data.name;
            if (data.authorName) book.authorName = data.authorName;
            if (data.imageUrl) book.imageUrl = data.imageUrl;
            if (data.pdfUrl) book.pdfUrl = data.pdfUrl;
            if (data.description) book.description = data.description;
            if (data.publishDate) book.publishDate = data.publishDate;

            const success = await this.bookCQRS.UpdateBook(id, book);

            if (success) {
                return c.json({ success: true, message: "Libro actualizado exitosamente" });
            } else {
                return c.json({ error: "No se pudo actualizar el libro" }, 500);
            }
        } catch (error: any) {
            console.error("Error editando libro:", error);
            return c.json({ error: error.message || "Error al editar libro" }, 400);
        }
    }

    async eliminarLibro(c: Context) {
        try {
            const id = c.req.param("id");
            const success = await this.bookDAO.deleteLibro(id);

            if (success) {
                return c.json({ success: true, message: "Libro eliminado exitosamente" });
            } else {
                return c.json({ error: "No se pudo eliminar el libro" }, 500);
            }
        } catch (error) {
            console.error("Error eliminando libro:", error);
            return c.json({ error: "Error al eliminar libro" }, 500);
        }
    }
}
