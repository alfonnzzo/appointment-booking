import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import publicRoutes from './src/routes/public.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import './src/models/associations.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 4000;

await connectDB();
app.listen(PORT, () => console.log(`API de turnos escuchando en http://localhost:${PORT}`));
