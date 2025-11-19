import { Hono } from "hono";
import { UserController } from "../controllers/user.controller";

const userRouter = new Hono();
const userController = new UserController();

// GET /usuarios - Listar todos los usuarios
userRouter.get("/", (c) => userController.listarUsuarios(c));

// GET /usuarios/:id - Obtener un usuario por ID
userRouter.get("/:id", (c) => userController.obtenerUsuario(c));

// POST /usuarios/guardar - Registrar nuevo usuario
userRouter.post("/guardar", (c) => userController.registrarUsuario(c));

// PUT /usuarios/editar/:id - Editar usuario existente
userRouter.put("/editar/:id", (c) => userController.editarUsuario(c));

// DELETE /usuarios/:id - Eliminar usuario
userRouter.delete("/:id", (c) => userController.eliminarUsuario(c));

export default userRouter;
