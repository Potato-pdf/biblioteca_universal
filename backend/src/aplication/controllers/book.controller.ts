import { Context } from "hono";
import { BookDAO } from "../../infrestructure/dao/books/book.dao";
import { BookCQRS } from "../../infrestructure/cqrs/books/book.cqrs";
import { BookViewModel } from "../viewmodels/book.viewmodel";
import { Book } from "../../domain/models/books/book.model";
import { OxfordApiService } from "../services/external/oxford.api.service";
import { UnamApiService } from "../services/external/unam.api.service";

export class BookController {
    private bookDAO: BookDAO;
    private bookCQRS: BookCQRS;

    constructor() {
        this.bookDAO = new BookDAO();
        this.bookCQRS = new BookCQRS();
    }

    async listarLibros(c: Context) {
        try {
            console.log("Iniciando listarLibros...");

            const [internalResult, oxfordResult, unamResult] = await Promise.allSettled([
                this.bookDAO.getAllLibrosInternos(),
                new OxfordApiService().getAllBooks(),
                new UnamApiService().getAllBooks()
            ]);

            let allBooks: BookViewModel[] = [];

            // 1. Procesar libros internos
            if (internalResult.status === 'fulfilled') {
                console.log(`Libros internos encontrados: ${internalResult.value.length}`);
                const internalViewModels = internalResult.value.map(book => BookViewModel.fromInternalBook(book));
                allBooks = [...allBooks, ...internalViewModels];
            } else {
                console.error("Error obteniendo libros internos:", internalResult.reason);
            }

            // 2. Procesar libros externos (Cambridge)
            if (oxfordResult.status === 'fulfilled') {
                console.log(`Libros Cambridge encontrados: ${oxfordResult.value.length}`);
                const oxfordViewModels = oxfordResult.value.map(book => BookViewModel.fromExternalBook(book, "Cambridge"));
                allBooks = [...allBooks, ...oxfordViewModels];
            } else {
                console.error("Error obteniendo libros de Cambridge:", oxfordResult.reason);
            }

            // 3. Procesar libros externos (UNAM/UTL)
            if (unamResult.status === 'fulfilled') {
                console.log(`Libros UNAM encontrados: ${unamResult.value.length}`);
                const unamViewModels = unamResult.value.map(book => BookViewModel.fromExternalBook(book, "UNAM"));
                allBooks = [...allBooks, ...unamViewModels];
            } else {
                console.error("Error obteniendo libros de UNAM:", unamResult.reason);
            }

            console.log(`Total de libros a retornar: ${allBooks.length}`);
            return c.json({ success: true, data: allBooks });
        } catch (error) {
            console.error("Error crítico listando libros:", error);
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
