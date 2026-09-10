import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { applyValidations } from '../middlewares/validator.js';
import {
  listarTurnos,
  actualizarEstadoTurno,
  listarServicios,
  crearServicio,
  actualizarServicio,
  listarBloqueos,
  crearBloqueo,
  borrarBloqueo,
} from '../controllers/admin.controller.js';

const adminRoutes = Router();
adminRoutes.use(authMiddleware);

adminRoutes.get('/turnos', query('desde').optional().isISO8601(), applyValidations, listarTurnos);

adminRoutes.patch(
  '/turnos/:id',
  param('id').isInt(),
  body('estado').isIn(['pendiente', 'confirmado', 'cancelado']),
  applyValidations,
  actualizarEstadoTurno,
);

adminRoutes.get('/servicios', listarServicios);

adminRoutes.post(
  '/servicios',
  body('nombre').isString().trim().isLength({ min: 2 }),
  body('duracionMinutos').isInt({ min: 5 }),
  body('precio').isFloat({ min: 0 }),
  applyValidations,
  crearServicio,
);

adminRoutes.patch(
  '/servicios/:id',
  param('id').isInt(),
  body('activo').optional().isBoolean(),
  body('nombre').optional().isString().trim().isLength({ min: 2 }),
  body('duracionMinutos').optional().isInt({ min: 5 }),
  body('precio').optional().isFloat({ min: 0 }),
  applyValidations,
  actualizarServicio,
);

adminRoutes.get('/bloqueos', query('desde').optional().isISO8601(), applyValidations, listarBloqueos);

adminRoutes.post(
  '/bloqueos',
  body('fecha').isISO8601(),
  body('horaInicio').matches(/^\d{2}:\d{2}$/),
  body('horaFin').matches(/^\d{2}:\d{2}$/),
  body('motivo').optional().isString().trim(),
  applyValidations,
  crearBloqueo,
);

adminRoutes.delete('/bloqueos/:id', param('id').isInt(), applyValidations, borrarBloqueo);

export default adminRoutes;
