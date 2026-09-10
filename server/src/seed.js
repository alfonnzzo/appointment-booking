import sequelize from './config/database.js';
import './models/associations.js';
import Servicio from './models/service.model.js';
import Usuario from './models/user.model.js';
import { hashPassword } from './helpers/bcrypt.js';

await sequelize.sync({ force: true });

await Servicio.bulkCreate([
  { nombre: 'Corte de cabello', duracionMinutos: 30, precio: 8000 },
  { nombre: 'Corte + barba', duracionMinutos: 45, precio: 12000 },
  { nombre: 'Coloración', duracionMinutos: 90, precio: 25000 },
]);

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'changeme123';
await Usuario.create({ username, passwordHash: await hashPassword(password) });

console.log(`Listo. Admin: ${username} / ${password}`);
process.exit(0);
