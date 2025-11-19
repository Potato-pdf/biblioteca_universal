import { Book } from "../../../models/books/book.model";

export interface IBookDAO {
    getAllLibrosInternos(): Promise<Book[]>;
    getLIbroInternoById(id: number): Promise<Book | null>;
    buscarLibrosINternosPorTitulo(titulo: string): Promise<Book[]>;
}