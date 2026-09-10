import { body, param } from 'express-validator';

export const idServicioValidation = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo'),
];

export const crearServicioValidation = [
  body('nombre')
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('duracionMinutos')
    .isInt({ min: 5, max: 480 })
    .withMessage('La duración debe ser un número entero entre 5 y 480 minutos'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
];

export const actualizarServicioValidation = [
  ...idServicioValidation,
  body('nombre')
    .optional()
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('duracionMinutos')
    .optional()
    .isInt({ min: 5, max: 480 })
    .withMessage('La duración debe ser un número entero entre 5 y 480 minutos'),
  body('precio').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('activo').optional().isBoolean().withMessage('El campo activo sólo puede ser true o false'),
];
