import { Router } from 'express';
import { applyValidations } from '../middlewares/validator.js';
import { disponibilidadValidation, crearTurnoValidation } from '../middlewares/validations/turno.validation.js';
import { listarServicios, obtenerDisponibilidad, crearTurno } from '../controllers/public.controller.js';

const publicRoutes = Router();

publicRoutes.get('/servicios', listarServicios);

publicRoutes.get('/disponibilidad', disponibilidadValidation, applyValidations, obtenerDisponibilidad);

publicRoutes.post('/turnos', crearTurnoValidation, applyValidations, crearTurno);

export default publicRoutes;
