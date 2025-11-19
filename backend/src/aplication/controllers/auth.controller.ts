import { Context } from "hono";
import { UserDAO } from "../../infrestructure/dao/users/user.dao";

export class AuthController {
    private userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }

    async login(c: Context) {
        try {
            const { email, password } = await c.req.json();

            if (!email || !password) {
                return c.json({ error: "Email y contraseña son requeridos" }, 400);
            }

            const user = await this.userDAO.findBYCredenciales(email);

            if (!user) {
                return c.json({ error: "Credenciales inválidas" }, 401);
            }

            const isPasswordValid = await Bun.password.verify(password, user.password);
            if (!isPasswordValid) {
                return c.json({ error: "Credenciales inválidas" }, 401);
            }

            return c.json({
                success: true,
                user: {
                    id: user.id,
                    nombre: user.name,  // Frontend espera 'nombre'
                    email: user.email,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error("Error en login:", error);
            return c.json({ error: "Error interno del servidor" }, 500);
        }
    }

    async logout(c: Context) {
        return c.json({ success: true, message: "Sesión cerrada" });
    }
}
