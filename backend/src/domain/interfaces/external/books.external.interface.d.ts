export interface IBookService   {
    searchExternalBooksByTitle(title: string): Promise<any[]>;
    getExternalBookById(id: string): Promise<any | null>;
}