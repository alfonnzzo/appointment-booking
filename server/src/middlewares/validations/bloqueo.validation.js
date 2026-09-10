import { body, param, query } from 'express-validator';
import { HORA_HHMM } from '../../constants/horarios.js';

export const idBloqueoValidation = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
];

export const listarBloqueosValidation = [
  query('desde').optional().isISO8601().withMessage('El parámetro desde debe tener el formato AAAA-MM-DD'),
];

export const crearBloqueoValidation = [
  body('fecha').isISO8601().withMessage('La fecha debe tener el formato AAAA-MM-DD'),
  body('horaInicio').matches(HORA_HHMM).withMessage('La hora de inicio debe tener el formato HH:mm, entre 00:00 y 23:59'),
  body('horaFin')
    .matches(HORA_HHMM)
    .withMessage('La hora de fin debe tener el formato HH:mm, entre 00:00 y 23:59')
    .custom((horaFin, { req }) => {
      if (horaFin <= req.body.horaInicio) {
        throw new Error('La hora de fin debe ser posterior a la hora de inicio');
      }
      return true;
    }),
  body('motivo')
    .optional()
    .isString()
    .withMessage('El motivo debe ser texto')
    .trim()
    .isLength({ max: 200 })
    .withMessage('El motivo no puede superar los 200 caracteres'),
];
