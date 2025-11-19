import 'reflect-metadata';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { AppDataSource } from './infrestructure/database/connecton.db';

// Importar rutas
import authRouter from './aplication/routes/auth.routes';
import userRouter from './aplication/routes/user.routes';
import bookRouter from './aplication/routes/book.routes';
import searchRouter from './aplication/routes/search.routes';
import uploadRouter_routes from './aplication/routes/upload.routes';

const app = new Hono();

// Middleware CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Inicializar base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('𒊑 Base de datos conectada correctamente 𒊑');
  })
  .catch((error) => {
    console.error('𒊑 Error conectando a la base de datos 𒊑:', error);
  });

// Ruta de prueba
app.get('/', (c) => {
  return c.json({ 
    message: '𒊑 API Biblioteca Universal 𒊑',
    version: '𒊑 1.0.0 𒊑 ',
    status: 'ペン online ペン'
  });
});

// Registrar rutas
app.route('/auth', authRouter);
app.route('/usuarios', userRouter);
app.route('/libros', bookRouter);
app.route('/buscar', searchRouter);
app.route('/', uploadRouter_routes); // UploadThing routes

// Manejo de rutas no encontradas
app.notFound((c) => {
  return c.json({ error: 'Ruta no encontrada 𒊑' }, 404);
});

// Manejo de errores
app.onError((err, c) => {
  console.error('𒊑 Error 𒊑:', err);
  return c.json({ error: '𒊑 Error interno del servidor 𒊑' }, 500);
});

console.log('𒊑 Servidor iniciado en http://localhost:3000 𒊑');

export default app;
