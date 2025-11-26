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
            c.status(500)
            return c.json({ error: "Error al obtener libros" });
        }
    }

    async obtenerLibro(c: Context) {
        try {
            const id = c.req.param("id");
            const book = await this.bookDAO.getLIbroInternoById(id);

            if (!book) {
                c.status(404)
                return c.json({ error: "Libro no encontrado" });
            }

            const viewModel = BookViewModel.fromInternalBook(book);
            return c.json({ success: true, data: viewModel });
        } catch (error) {
            console.error("Error obteniendo libro:", error);
            c.status(500)
            return c.json({ error: "Error al obtener libro" });
        }
    }

    async registrarLibro(c: Context) {
        try {
            const data = await c.req.json();

            const book = new Book();
            book.titulo = data.titulo;
            book.authorName = data.authorName;
            book.portadaBase64 = data.portadaBase64;
            book.pdfBase64 = data.pdfBase64;
            book.genero = data.genero || "";
            book.publishDate = data.publishDate || new Date().toISOString().split('T')[0];

            const success = await this.bookCQRS.CreateBook(book);

            if (success) {
                return c.json({ success: true, message: "Libro registrado exitosamente" }, 201);
            } else {
                c.status(500)
                return c.json({ error: "No se pudo registrar el libro" });
            }
        } catch (error: any) {
            console.error("Error registrando libro:", error);
            c.status(400)
            return c.json({ error: error.message || "Error al registrar libro" });
        }
    }

    async editarLibro(c: Context) {
        try {
            const id = c.req.param("id");
            const data = await c.req.json();

            const book = new Book();
            if (data.titulo) book.titulo = data.titulo;
            if (data.authorName) book.authorName = data.authorName;
            if (data.portadaBase64) book.portadaBase64 = data.portadaBase64;
            if (data.pdfBase64) book.pdfBase64 = data.pdfBase64;
            if (data.genero) book.genero = data.genero;
            if (data.publishDate) book.publishDate = data.publishDate;

            const success = await this.bookCQRS.UpdateBook(id, book);

            if (success) {
                return c.json({ success: true, message: "Libro actualizado exitosamente" });
            } else {
                c.status(500)
                return c.json({ error: "No se pudo actualizar el libro" });
            }
        } catch (error: any) {
            console.error("Error editando libro:", error);
            c.status(400)
            return c.json({ error: error.message || "Error al editar libro" });
        }
    }

    async eliminarLibro(c: Context) {
        try {
            const id = c.req.param("id");
            const success = await this.bookCQRS.DeleteBook(id);

            if (success) {
                return c.json({ success: true, message: "Libro eliminado exitosamente" });
            } else {
                c.status(500)
                return c.json({ error: "No se pudo eliminar el libro" });
            }
        } catch (error) {
            console.error("Error eliminando libro:", error);
            c.status(500)
            return c.json({ error: "Error al eliminar libro" });
        }
    }
}
