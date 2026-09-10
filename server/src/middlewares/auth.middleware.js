import { verifyToken } from '../helpers/jwt.js';
import Usuario from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization ?? '';
  const token = req.cookies?.token ?? (header.startsWith('Bearer ') ? header.slice(7) : null);
  if (!token) return res.status(401).json({ error: 'Falta el token de autenticación.' });

  try {
    const payload = verifyToken(token);
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario) return res.status(401).json({ error: 'El usuario del token ya no existe.' });

    req.usuario = usuario;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o vencido.' });
  }
};
