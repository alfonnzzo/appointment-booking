import Usuario from '../models/user.model.js';
import { comparePasswords } from '../helpers/bcrypt.js';
import { signToken } from '../helpers/jwt.js';

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario || !(await comparePasswords(password, usuario.passwordHash))) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    res.json({ token: signToken(usuario) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
