export class UserViewModel {
    id: string;
    nombre: string;
    email: string;
    rol: string;

    constructor(data: {
        id: string;
        name: string;
        email: string;
        rol: string;
    }) {
        this.id = data.id;
        this.nombre = data.name;
        this.email = data.email;
        this.rol = data.rol;
    }

    static fromUser(user: any): UserViewModel {
        return new UserViewModel({
            id: user.id,
            name: user.name,
            email: user.email,
            rol: user.rol
        });
    }

    static fromUserList(users: any[]): UserViewModel[] {
        return users.map(user => UserViewModel.fromUser(user));
    }
}
