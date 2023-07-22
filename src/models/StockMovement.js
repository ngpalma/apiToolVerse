const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('stockMovement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        },
        type: {
        type: DataTypes.ENUM('entrada', 'salida'),
        allowNull: false,
        },
        quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        }
  },{timestamps: false});
};