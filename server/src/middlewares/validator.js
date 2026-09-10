import { validationResult } from 'express-validator';

// Se coloca después de las reglas de express-validator (body/query/param) en la
// ruta. Si alguna falló, corta acá y el controlador ni se ejecuta.
export function applyValidations(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  next();
}
