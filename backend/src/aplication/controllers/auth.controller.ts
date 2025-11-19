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

            // Buscar usuario por credenciales
            const user = await this.userDAO.findBYCredenciales(email, password);

            if (!user) {
                return c.json({ error: "Credenciales inválidas" }, 401);
            }

            // En producción, aquí deberías generar un JWT
            // Por ahora, solo devolvemos los datos del usuario
            return c.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
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
        // En producción, aquí invalidarías el JWT
        return c.json({ success: true, message: "Sesión cerrada" });
    }
}
