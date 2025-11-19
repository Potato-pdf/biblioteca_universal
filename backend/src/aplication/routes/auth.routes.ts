import { Hono } from "hono";
import { AuthController } from "../controllers/auth.controller";

const authRouter = new Hono();
const authController = new AuthController();

// POST /login - Iniciar sesión
authRouter.post("/login", (c) => authController.login(c));

// POST /logout - Cerrar sesión
authRouter.post("/logout", (c) => authController.logout(c));

export default authRouter;
