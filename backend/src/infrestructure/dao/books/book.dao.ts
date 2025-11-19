import { AppDataSource } from "../../database/connecton.db";
import { Book } from "../../../domain/models/books/book.model";
import { IBookDAO } from "../../../domain/interfaces/books/DAO/book.dao.interface";
import { Like } from "typeorm";

export class BookDAO implements IBookDAO {
    private bookRepository = AppDataSource.getRepository(Book);

    async getAllLibrosInternos(): Promise<Book[]> {
        return await this.bookRepository.find();
    }

    async getLIbroInternoById(id: number): Promise<Book | null> {
        return await this.bookRepository.findOneBy({ id: id.toString() });
    }

    async buscarLibrosINternosPorTitulo(titulo: string): Promise<Book[]> {
        return await this.bookRepository.find({
            where: { name: Like(`%${titulo}%`) }
        });
    }

    async insertLibro(book: Book): Promise<boolean> {
        try {
            await this.bookRepository.save(book);
            return true;
        } catch (error) {
            console.error("Error insertando libro:", error);
            return false;
        }
    }

    async updateLibro(id: string, book: Partial<Book>): Promise<boolean> {
        try {
            const result = await this.bookRepository.update({ id }, book);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error actualizando libro:", error);
            return false;
        }
    }

    async deleteLibro(id: string): Promise<boolean> {
        try {
            const result = await this.bookRepository.delete({ id });
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error eliminando libro:", error);
            return false;
        }
    }
}
