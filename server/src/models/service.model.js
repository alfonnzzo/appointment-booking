import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Servicio = sequelize.define('Servicio', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  duracionMinutos: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

export default Servicio;
