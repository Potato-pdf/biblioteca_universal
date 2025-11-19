import { Hono } from "hono";
import { SearchController } from "../controllers/search.controller";

const searchRouter = new Hono();
const searchController = new SearchController();

// GET /buscar?q=termino - Buscar libros (internos y externos)
searchRouter.get("/", (c) => searchController.buscarLibros(c));

// GET /verLibro/:idLibro/:idUni - Ver detalle de un libro específico
searchRouter.get("/:idLibro/:idUni", (c) => searchController.verLibro(c));

export default searchRouter;
