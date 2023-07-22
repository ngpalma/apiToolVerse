const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('session', {
    sid:{
      type:DataTypes.STRING,
      primaryKey:true,
    },
    sess:{
      type:DataTypes.JSON,  
    },
    expire:{
      allowNull:false,
      type:'TIMESTAMP',
    }
  },{
    tableName: 'session',
    timestamps: false
  });
};