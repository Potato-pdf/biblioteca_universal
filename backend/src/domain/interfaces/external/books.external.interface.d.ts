export interface IBookService   {
    searchExternalBooksByTitle(title: string): Promise<any[]>;
}