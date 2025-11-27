import { Hono } from "hono";
import { BookController } from "../controllers/book.controller";

const bookRouter = new Hono();
const bookController = new BookController();

// GET /libros - Listar todos los libros (locales + externos)
bookRouter.get("/", (c) => bookController.listarLibros(c));

// GET /libros/internos - Listar solo libros internos/locales (para admin)
bookRouter.get("/internos", (c) => bookController.listarLibrosInternos(c));

// GET /libros/:id - Obtener un libro por ID
bookRouter.get("/:id", (c) => bookController.obtenerLibro(c));

// POST /libros/guardar - Registrar nuevo libro
bookRouter.post("/guardar", (c) => bookController.registrarLibro(c));

// PUT /libros/editar/:id - Editar libro existente
bookRouter.put("/editar/:id", (c) => bookController.editarLibro(c));

// DELETE /libros/:id - Eliminar libro
bookRouter.delete("/:id", (c) => bookController.eliminarLibro(c));

export default bookRouter;
