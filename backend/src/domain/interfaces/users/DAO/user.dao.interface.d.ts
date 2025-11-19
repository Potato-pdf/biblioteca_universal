import { User } from "../../../models/users/user.model";

export interface IUsuarioDAO{
    getAllUsuarios(): Promise<User[]>
    getUsuarioById(id: number): Promise<User | null>
    findBYCredenciales(email: string, password: string): Promise<User | null>
}

