import { verifyToken } from '../helpers/jwt.js';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Falta el token de autenticación.' });

  try {
    req.usuario = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o vencido.' });
  }
}
