import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import publicRoutes from './src/routes/public.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import './src/models/associations.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido.' });
  }
  res.status(status).json({ error: err.expose ? err.message : 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 4000;

await connectDB();
app.listen(PORT, () => console.log(`API de turnos escuchando en http://localhost:${PORT}`));
