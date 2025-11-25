import { User } from "../../../models/users/user.model";

export interface IUserCQRS {
    CreateUser(data: User): Promise<boolean>;
    UpdateUser(id: string, data: User): Promise<boolean>;
    DeleteUser(id: string): Promise<boolean>;
}
