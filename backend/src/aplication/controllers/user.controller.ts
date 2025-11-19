import { Context } from "hono";
import { UserDAO } from "../../infrestructure/dao/users/user.dao";
import { UserCQRS } from "../../infrestructure/cqrs/users/user.cqrs";
import { UserViewModel } from "../viewmodels/user.viewmodel";
import { User } from "../../domain/models/users/user.model";

export class UserController {
    private userDAO: UserDAO;
    private userCQRS: UserCQRS;

    constructor() {
        this.userDAO = new UserDAO();
        this.userCQRS = new UserCQRS();
    }

    async listarUsuarios(c: Context) {
        try {
            const users = await this.userDAO.getAllUsuarios();
            const viewModels = UserViewModel.fromUserList(users);
            return c.json({ success: true, data: viewModels });
        } catch (error) {
            console.error("Error listando usuarios:", error);
            c.status(500)
            return c.json({ error: "Error al obtener usuarios" });
        }
    }

    async obtenerUsuario(c: Context) {
        try {
            const id = parseInt(c.req.param("id"));
            const user = await this.userDAO.getUsuarioById(id);

            if (!user) {
                c.status(404)
                return c.json({ error: "Usuario no encontrado" });
            }

            const viewModel = UserViewModel.fromUser(user);
            return c.json({ success: true, data: viewModel });
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            c.status(404)
            return c.json({ error: "Error al obtener usuario" });
        }
    }

    async registrarUsuario(c: Context) {
        try {
            const data = await c.req.json();

            const user = new User();
            user.name = data.name;
            user.email = data.email;
            user.rol = data.rol;

            const success = await this.userCQRS.CreateUser(user);

            if (success) {
                return c.json({ success: true, message: "Usuario registrado exitosamente" }, 201);
            } else {
                return c.json({ error: "No se pudo registrar el usuario" }, 500);
            }
        } catch (error: any) {
            console.error("Error registrando usuario:", error);
            return c.json({ error: error.message || "Error al registrar usuario" }, 400);
        }
    }

    async editarUsuario(c: Context) {
        try {
            const id = parseInt(c.req.param("id"));
            const data = await c.req.json();

            const user = new User();
            if (data.name) user.name = data.name;
            if (data.email) user.email = data.email;
            if (data.rol) user.rol = data.rol;

            const success = await this.userCQRS.UpdateUser(id, user);

            if (success) {
                return c.json({ success: true, message: "Usuario actualizado exitosamente" });
            } else {
                return c.json({ error: "No se pudo actualizar el usuario" }, 500);
            }
        } catch (error: any) {
            console.error("Error editando usuario:", error);
            return c.json({ error: error.message || "Error al editar usuario" }, 400);
        }
    }

    async eliminarUsuario(c: Context) {
        try {
            const id = c.req.param("id");
            const success = await this.userDAO.deleteUsuario(id);

            if (success) {
                return c.json({ success: true, message: "Usuario eliminado exitosamente" });
            } else {
                return c.json({ error: "No se pudo eliminar el usuario" }, 500);
            }
        } catch (error) {
            console.error("Error eliminando usuario:", error);
            return c.json({ error: "Error al eliminar usuario" }, 500);
        }
    }
}
