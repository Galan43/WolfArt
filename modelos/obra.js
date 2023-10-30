const { DataTypes, Model } = require('sequelize');
const sequelize = require('../BD/conexion'); // Importa tu configuración de Sequelize

class Obras extends Model {}

Obras.init({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artista: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: DataTypes.TEXT,
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  foto: DataTypes.STRING,
}, {
  sequelize, // Asociación con la instancia Sequelize
  modelName: 'Obras', // Nombre del modelo
  tableName: 'obras', // Nombre de la tabla en la base de datos
});

module.exports = Obras;
