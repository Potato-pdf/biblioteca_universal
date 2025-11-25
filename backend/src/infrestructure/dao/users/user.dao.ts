import { AppDataSource } from "../../database/connecton.db";
import { User } from "../../../domain/models/users/user.model";
import { IUsuarioDAO } from "../../../domain/interfaces/users/DAO/user.dao.interface";

export class UserDAO implements IUsuarioDAO {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsuarios(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUsuarioById(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ id: id });
    }

    async findBYCredenciales(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { email }
        });
    }

    async insertUsuario(user: User): Promise<boolean> {
        try {
            await this.userRepository.save(user);
            return true;
        } catch (error) {
            console.error("Error insertando usuario:", error);
            return false;
        }
    }

    async updateUsuario(id: string, user: Partial<User>): Promise<boolean> {
        try {
            const userFound = await this.userRepository.findOneBy({ id: id });
            if (!userFound) {
                return false;
            }
            const result = await this.userRepository.update({ id: id }, user);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            return false;
        }
    }

    async deleteUsuario(id: string): Promise<boolean> {
        try {
            const result = await this.userRepository.delete({ id: id });
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error eliminando usuario:", error);
            return false;
        }
    }
}
