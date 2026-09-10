import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Bloqueo = sequelize.define('Bloqueo', {
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  horaInicio: { type: DataTypes.STRING, allowNull: false },
  horaFin: { type: DataTypes.STRING, allowNull: false },
  motivo: { type: DataTypes.STRING, allowNull: true },
});

export default Bloqueo;
