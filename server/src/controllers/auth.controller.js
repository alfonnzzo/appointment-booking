import Usuario from '../models/user.model.js';
import { comparePasswords } from '../helpers/bcrypt.js';
import { signToken } from '../helpers/jwt.js';

const EN_PRODUCCION = process.env.NODE_ENV === 'production';
const DOCE_HORAS = 1000 * 60 * 60 * 12;

const OPCIONES_COOKIE = {
  httpOnly: true,
  secure: EN_PRODUCCION,
  sameSite: EN_PRODUCCION ? 'none' : 'lax',
  path: '/',
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({ where: { username } });

    if (!usuario || !(await comparePasswords(password, usuario.passwordHash))) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    res.cookie('token', signToken(usuario), { ...OPCIONES_COOKIE, maxAge: DOCE_HORAS });
    res.json({ id: usuario.id, username: usuario.username });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req, res) => {
  res.clearCookie('token', OPCIONES_COOKIE);
  res.status(204).end();
};

export const me = (req, res) => {
  res.json({ id: req.usuario.id, username: req.usuario.username });
};
