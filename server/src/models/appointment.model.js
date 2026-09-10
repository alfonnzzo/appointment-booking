import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

const Turno = sequelize.define('Turno', {
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  horaInicio: { type: DataTypes.STRING, allowNull: false }, // 'HH:mm'
  horaFin: { type: DataTypes.STRING, allowNull: false },
  clienteNombre: { type: DataTypes.STRING, allowNull: false },
  clienteTelefono: { type: DataTypes.STRING, allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
});

export default Turno;
