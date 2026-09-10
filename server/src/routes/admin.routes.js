import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { applyValidations } from '../middlewares/validator.js';
import { listarTurnosValidation, actualizarEstadoTurnoValidation } from '../middlewares/validations/turno.validation.js';
import { crearServicioValidation, actualizarServicioValidation } from '../middlewares/validations/servicio.validation.js';
import {
  listarBloqueosValidation,
  crearBloqueoValidation,
  idBloqueoValidation,
} from '../middlewares/validations/bloqueo.validation.js';
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

adminRoutes.get('/turnos', listarTurnosValidation, applyValidations, listarTurnos);
adminRoutes.patch('/turnos/:id', actualizarEstadoTurnoValidation, applyValidations, actualizarEstadoTurno);

adminRoutes.get('/servicios', listarServicios);
adminRoutes.post('/servicios', crearServicioValidation, applyValidations, crearServicio);
adminRoutes.patch('/servicios/:id', actualizarServicioValidation, applyValidations, actualizarServicio);

adminRoutes.get('/bloqueos', listarBloqueosValidation, applyValidations, listarBloqueos);
adminRoutes.post('/bloqueos', crearBloqueoValidation, applyValidations, crearBloqueo);
adminRoutes.delete('/bloqueos/:id', idBloqueoValidation, applyValidations, borrarBloqueo);

export default adminRoutes;
