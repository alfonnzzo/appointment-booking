import { Router } from 'express';
import { body, query } from 'express-validator';
import { applyValidations } from '../middlewares/validator.js';
import { listarServicios, obtenerDisponibilidad, crearTurno } from '../controllers/public.controller.js';

const publicRoutes = Router();

publicRoutes.get('/servicios', listarServicios);

publicRoutes.get(
  '/disponibilidad',
  query('servicioId').isInt(),
  query('fecha').isISO8601(),
  applyValidations,
  obtenerDisponibilidad,
);

publicRoutes.post(
  '/turnos',
  body('servicioId').isInt(),
  body('fecha').isISO8601(),
  body('horaInicio').matches(/^\d{2}:\d{2}$/),
  body('clienteNombre').isString().trim().isLength({ min: 2 }),
  body('clienteTelefono').isString().trim().isLength({ min: 6 }),
  applyValidations,
  crearTurno,
);

export default publicRoutes;
