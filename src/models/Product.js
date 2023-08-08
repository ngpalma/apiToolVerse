const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: { // Campo para almacenar la URL de la imagen
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 15, // Establecer el valor predeterminado en 15
    }
  },{timestamps: true});
};





