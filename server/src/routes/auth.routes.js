import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { applyValidations } from '../middlewares/validator.js';
import { loginValidation } from '../middlewares/validations/auth.validation.js';
import { login, logout, me } from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post('/login', loginValidation, applyValidations, login);
authRoutes.post('/logout', logout);
authRoutes.get('/me', authMiddleware, me);

export default authRoutes;
