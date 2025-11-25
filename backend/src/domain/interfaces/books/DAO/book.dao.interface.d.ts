import { Book } from "../../../models/books/book.model";

export interface IBookDAO {
    getAllLibrosInternos(): Promise<Book[]>;
    getLIbroInternoById(id: string): Promise<Book | null>;
    buscarLibrosINternosPorTitulo(titulo: string): Promise<Book[]>;
    insertLibro(book: Book): Promise<boolean>;
    updateLibro(id: string, book: Partial<Book>): Promise<boolean>;
    deleteLibro(id: string): Promise<boolean>;
}