import { body, param, query } from 'express-validator';
import { HORA_HHMM } from '../../constants/horarios.js';

export const disponibilidadValidation = [
  query('servicioId').isInt({ min: 1 }).withMessage('El servicioId debe ser un número entero positivo'),
  query('fecha').isISO8601().withMessage('La fecha debe tener el formato AAAA-MM-DD'),
];

export const crearTurnoValidation = [
  body('servicioId').isInt({ min: 1 }).withMessage('El servicioId debe ser un número entero positivo'),
  body('fecha').isISO8601().withMessage('La fecha debe tener el formato AAAA-MM-DD'),
  body('horaInicio').matches(HORA_HHMM).withMessage('La hora de inicio debe tener el formato HH:mm, entre 00:00 y 23:59'),
  body('clienteNombre')
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('clienteTelefono')
    .isString()
    .withMessage('El teléfono debe ser texto')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('El teléfono debe tener entre 6 y 20 caracteres'),
];

export const listarTurnosValidation = [
  query('desde').optional().isISO8601().withMessage('El parámetro desde debe tener el formato AAAA-MM-DD'),
];

export const actualizarEstadoTurnoValidation = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
  body('estado')
    .isIn(['pendiente', 'confirmado', 'cancelado'])
    .withMessage("El estado sólo puede ser 'pendiente', 'confirmado' o 'cancelado'"),
];
