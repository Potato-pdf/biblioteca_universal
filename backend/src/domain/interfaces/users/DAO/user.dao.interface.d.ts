import { User } from "../../../models/users/user.model";

export interface IUsuarioDAO {
    getAllUsuarios(): Promise<User[]>
    getUsuarioById(id: string): Promise<User | null>;
    findBYCredenciales(email: string): Promise<User | null>;
    insertUsuario(user: User): Promise<boolean>;
    updateUsuario(id: string, user: Partial<User>): Promise<boolean>;
    deleteUsuario(id: string): Promise<boolean>;
}
