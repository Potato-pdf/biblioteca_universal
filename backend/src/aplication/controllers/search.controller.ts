import { Context } from "hono";
import { BookDAO } from "../../infrestructure/dao/books/book.dao";
import { BookViewModel } from "../viewmodels/book.viewmodel";
import { UtlApiService } from "../services/external/utl.api.service";
import { UnamApiService } from "../services/external/unam.api.service";
import { OxfordApiService } from "../services/external/oxford.api.service";

export class SearchController {
    private bookDAO: BookDAO;
    private utlService: UtlApiService;
    private unamService: UnamApiService;
    private oxfordService: OxfordApiService;

    constructor() {
        this.bookDAO = new BookDAO();
        this.utlService = new UtlApiService();
        this.unamService = new UnamApiService();
        this.oxfordService = new OxfordApiService();
    }

    async buscarLibros(c: Context) {
        try {
            const filtro = c.req.query("q") || "";

            console.log(`Buscando libros con filtro: "${filtro || '(vacío - todos los libros)'}"`);

            let viewModelsInternos: BookViewModel[] = [];
            try {
                const librosInternos = filtro
                    ? await this.bookDAO.buscarLibrosINternosPorTitulo(filtro)
                    : await this.bookDAO.getAllLibrosInternos();

                viewModelsInternos = librosInternos.map(libro =>
                    BookViewModel.fromInternalBook(libro)
                );
                console.log(`Libros internos: ${viewModelsInternos.length}`);
            } catch (error) {
                console.error("Error cargando libros internos:", error);
            }
            let viewModelsUtl: BookViewModel[] = [];
            let viewModelsUnam: BookViewModel[] = [];
            let viewModelsOxford: BookViewModel[] = [];

            try {
                const librosUtl = await this.utlService.searchExternalBooksByTitle(filtro);
                viewModelsUtl = librosUtl.map(libro =>
                    BookViewModel.fromExternalBook(libro, "Universidad Tecnológica de León")
                );
                console.log(`UTL: ${viewModelsUtl.length} libros`);
            } catch (error) {
                console.error("UTL no disponible, continuando...", error);
            }
            try {
                const librosUnam = await this.unamService.searchExternalBooksByTitle(filtro);
                viewModelsUnam = librosUnam.map(libro =>
                    BookViewModel.fromExternalBook(libro, "Universidad Nacional Autónoma de México")
                );
                console.log(`UNAM: ${viewModelsUnam.length} libros`);
            } catch (error) {
                console.error("UNAM no disponible, continuando...", error);
            }
            try {
                const librosOxford = await this.oxfordService.searchExternalBooksByTitle(filtro);
                viewModelsOxford = librosOxford.map(libro =>
                    BookViewModel.fromExternalBook(libro, "Oxford University")
                );
                console.log(`Oxford: ${viewModelsOxford.length} libros`);
            } catch (error) {
                console.error("Oxford no disponible, continuando...", error);
            }

            const todosLosLibros = [
                ...viewModelsInternos,
                ...viewModelsUtl,
                ...viewModelsUnam,
                ...viewModelsOxford
            ];

            console.log(`Total de libros encontrados: ${todosLosLibros.length}`);

            return c.json({
                success: true,
                data: todosLosLibros,
                stats: {
                    internos: viewModelsInternos.length,
                    externos: {
                        utl: viewModelsUtl.length,
                        unam: viewModelsUnam.length,
                        oxford: viewModelsOxford.length
                    },
                    total: todosLosLibros.length
                }
            });
        } catch (error) {
            console.error("Error general en búsqueda:", error);
            return c.json({ error: "Error al buscar libros" }, 500);
        }
    }

    async verLibro(c: Context) {
        try {
            const idLibro = c.req.param("idLibro");
            const idUniversidad = c.req.param("idUni");

            if (idUniversidad === "interno" || idUniversidad === "Biblioteca Local") {
                const libro = await this.bookDAO.getLIbroInternoById(idLibro);

                if (!libro) {
                    return c.json({ error: "Libro no encontrado" }, 404);
                }

                const viewModel = BookViewModel.fromInternalBook(libro);
                return c.json({ success: true, data: viewModel });
            } else {
                let libro = null;

                switch (idUniversidad) {
                    case "Universidad Tecnológica de León":
                    case "utl":
                        libro = await this.utlService.getExternalBookById(idLibro);
                        break;
                    case "Universidad Nacional Autónoma de México":
                    case "unam":
                        libro = await this.unamService.getExternalBookById(idLibro);
                        break;
                    case "Oxford University":
                    case "oxford":
                        libro = await this.oxfordService.getExternalBookById(idLibro);
                        break;
                    default:
                        return c.json({ error: "Universidad no reconocida" }, 400);
                }

                if (!libro) {
                    return c.json({ error: "Libro no encontrado" }, 404);
                }

                const viewModel = BookViewModel.fromExternalBook(libro, idUniversidad);
                return c.json({ success: true, data: viewModel });
            }
        } catch (error) {
            console.error("Error obteniendo libro:", error);
            return c.json({ error: "Error al obtener libro" }, 500);
        }
    }
}
