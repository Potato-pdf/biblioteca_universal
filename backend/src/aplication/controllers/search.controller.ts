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

            if (!filtro) {
                return c.json({ error: "Debe proporcionar un término de búsqueda" }, 400);
            }

            const librosInternos = await this.bookDAO.buscarLibrosINternosPorTitulo(filtro);
            const viewModelsInternos = librosInternos.map(libro => 
                BookViewModel.fromInternalBook(libro)
            );

            const [librosUtl, librosUnam, librosOxford] = await Promise.all([
                this.utlService.searchExternalBooksByTitle(filtro),
                this.unamService.searchExternalBooksByTitle(filtro),
                this.oxfordService.searchExternalBooksByTitle(filtro)
            ]);

            const viewModelsUtl = librosUtl.map(libro => 
                BookViewModel.fromExternalBook(libro, "Universidad Tecnológica de León")
            );
            const viewModelsUnam = librosUnam.map(libro => 
                BookViewModel.fromExternalBook(libro, "Universidad Nacional Autónoma de México")
            );
            const viewModelsOxford = librosOxford.map(libro => 
                BookViewModel.fromExternalBook(libro, "Oxford University")
            );

            const todosLosLibros = [
                ...viewModelsInternos,
                ...viewModelsUtl,
                ...viewModelsUnam,
                ...viewModelsOxford
            ];

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
            console.error("Error en búsqueda:", error);
            return c.json({ error: "Error al buscar libros" }, 500);
        }
    }

    async verLibro(c: Context) {
        try {
            const idLibro = c.req.param("idLibro");
            const idUniversidad = c.req.param("idUni");

            if (idUniversidad === "interno" || idUniversidad === "Biblioteca Universidad Gustambo") {
                const libro = await this.bookDAO.getLIbroInternoById(parseInt(idLibro));
                
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
