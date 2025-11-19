import { DataSource } from "typeorm";
import { User } from "../../domain/models/users/user.model";
import { Book } from "../../domain/models/books/book.model";


export const AppDataSource = new DataSource({
      type: "postgres",
    host: "localhost",
    port: 11432,
    username: "user",
    password: "password",
    database: "hono_db",
    synchronize: true,
    logging: false,
    entities: [User, Book],
});
