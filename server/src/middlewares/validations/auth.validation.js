import { body } from 'express-validator';

export const loginValidation = [
  body('username')
    .isString()
    .withMessage('El username debe ser texto')
    .trim()
    .notEmpty()
    .withMessage('El username es obligatorio'),
  body('password')
    .isString()
    .withMessage('El password debe ser texto')
    .notEmpty()
    .withMessage('El password es obligatorio'),
];
