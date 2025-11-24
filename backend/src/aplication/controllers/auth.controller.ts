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
                c.status(400);
                return c.json({ error: "Email y contraseña son requeridos" });
            }

            const user = await this.userDAO.findBYCredenciales(email);

            if (!user) {
                c.status(401);
                return c.json({ error: "Credenciales inválidas" });
            }

            const isPasswordValid = await Bun.password.verify(password, user.password);
            if (!isPasswordValid) {
                c.status(401);
                return c.json({ error: "Credenciales inválidas" });
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
            c.status(500);
            return c.json({ error: "Error interno del servidor" });
        }
    }

    async logout(c: Context) {
        c.status(200);
        return c.json({ success: true, message: "Sesión cerrada" });
    }
}
