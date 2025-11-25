import { Book } from "../../../models/books/book.model";

export interface IBookCQRS {
    CreateBook(data: Book): Promise<boolean>;
    UpdateBook(id: string, data: Book): Promise<boolean>;
}