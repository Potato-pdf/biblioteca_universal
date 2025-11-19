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
        // Validaciones simples
        if (!data.name || !data.email || !data.rol) {
            throw new Error("Datos incompletos para crear usuario");
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error("Formato de email inválido");
        }

        // Validar rol
        if (data.rol !== "bibliotecario" && data.rol !== "alumno") {
            throw new Error("Rol inválido");
        }

        // Generar ID
        data.id = randomUUID();

        // Llamar al DAO para ejecutar el cambio
        return await this.userDAO.insertUsuario(data);
    }

    async UpdateUser(id: number, data: User): Promise<boolean> {
        // Validaciones simples
        if (!data.name && !data.email && !data.rol) {
            throw new Error("Debe proporcionar al menos un campo para actualizar");
        }

        // Validar formato de email si se proporciona
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error("Formato de email inválido");
            }
        }

        // Validar rol si se proporciona
        if (data.rol && data.rol !== "bibliotecario" && data.rol !== "alumno") {
            throw new Error("Rol inválido");
        }

        // Llamar al DAO para ejecutar el cambio
        return await this.userDAO.updateUsuario(id.toString(), data);
    }
}
