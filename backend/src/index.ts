import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { AppDataSource } from './infrestructure/database/connecton.db';

// Importar rutas
import authRouter from './aplication/routes/auth.routes';
import userRouter from './aplication/routes/user.routes';
import bookRouter from './aplication/routes/book.routes';
import searchRouter from './aplication/routes/search.routes';

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
    console.log('✅ Base de datos conectada correctamente');
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error);
  });

// Ruta de prueba
app.get('/', (c) => {
  return c.json({ 
    message: 'API Biblioteca Universal',
    version: '1.0.0',
    status: 'online'
  });
});

// Registrar rutas
app.route('/auth', authRouter);
app.route('/usuarios', userRouter);
app.route('/libros', bookRouter);
app.route('/buscar', searchRouter);

// Manejo de rutas no encontradas
app.notFound((c) => {
  return c.json({ error: 'Ruta no encontrada' }, 404);
});

// Manejo de errores
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Error interno del servidor' }, 500);
});

console.log('🚀 Servidor iniciado en http://localhost:3000');

export default app;
