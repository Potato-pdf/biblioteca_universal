import { book } from "../books/book.interface";

export interface IBookService   {
    searchExternalBooksByTitle(title: string): Promise<book[]>;
    getExternalBookById(id: string): Promise<book | null>;
}