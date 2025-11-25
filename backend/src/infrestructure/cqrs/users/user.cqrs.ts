import { User } from "../../../domain/models/users/user.model";
import { IUserCQRS } from "../../../domain/interfaces/users/CQRS/user.cqrs.interface";
import { UserDAO } from "../../dao/users/user.dao";
import { randomUUID } from "crypto";

export class UserCQRS implements IUserCQRS {
    private userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }

    async CreateUser(data: User): Promise<boolean> {
        if (!data.name || !data.email || !data.rol) {
            throw new Error("Datos incompletos para crear usuario");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error("Formato de email inválido");
        }

        if (data.rol !== "bibliotecario" && data.rol !== "alumno") {
            throw new Error("Rol inválido");
        }

        if (!data.password) {
            throw new Error("La contraseña es requerida");
        }

        // Hash de la contraseña
        const hashedPassword = await Bun.password.hash(data.password);
        data.password = hashedPassword;
        data.id = randomUUID();

        return await this.userDAO.insertUsuario(data);
    }

    async UpdateUser(id: string, data: User): Promise<boolean> {
        if (!data.name && !data.email && !data.rol) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error("Formato de email inválido");
            }
        }

        if (data.rol && data.rol !== "bibliotecario" && data.rol !== "alumno") {
            throw new Error("Rol inválido");
        }

        return await this.userDAO.updateUsuario(id, data);
    }

    async DeleteUser(id: string): Promise<boolean> {
        return await this.userDAO.deleteUsuario(id);
    }
}
