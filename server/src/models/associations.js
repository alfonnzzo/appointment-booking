import Servicio from './service.model.js';
import Turno from './appointment.model.js';
import './block.model.js';
import './user.model.js';

Servicio.hasMany(Turno, { foreignKey: 'servicioId' });
Turno.belongsTo(Servicio, { foreignKey: 'servicioId' });
