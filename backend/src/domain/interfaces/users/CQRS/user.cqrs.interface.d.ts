import { User } from "../../../models/users/user.model";

export interface IUserCQRS {
    CreateUser(data: User): Promise<boolean>;
    UpdateUser(id:number, data: User): Promise<boolean>;
}
