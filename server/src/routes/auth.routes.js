import { Router } from 'express';
import { body } from 'express-validator';
import { applyValidations } from '../middlewares/validator.js';
import { login } from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post(
  '/login',
  body('username').isString().trim().notEmpty(),
  body('password').isString().notEmpty(),
  applyValidations,
  login,
);

export default authRoutes;
