require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const bcrypt=require('bcrypt')
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(
   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/toolverse`,
   {
      logging: false, // set to console.log to see the raw SQL queries
      native: false, // lets Sequelize know we can use pg-native for ~30% more speed
   }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
   .filter(
      (file) =>
         file.indexOf('.') !== 0 &&
         file !== basename &&
         file.slice(-3) === '.js'
   )
   .forEach((file) => {
      modelDefiners.push(require(path.join(__dirname, '/models', file)));
   });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
   entry[0][0].toUpperCase() + entry[0].slice(1),
   entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring

const { PaymentMethod, Product, PurchaseCart, PurchaseDetail, PurchaseOrder, ShippingAddress, User, Review,Task, StockMovement } = sequelize.models;
// Aca vendrian las relaciones
//1--> Usuario - Carrito
// console.log(sequelize.models)
User.hasMany(PurchaseCart);
PurchaseCart.belongsTo(User);
//2--> Usuario - Orden de compra

User.hasMany(Task)
Task.belongsTo(User);

User.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(User);
//3--> Usuario - Direccion de envio
User.hasOne(ShippingAddress);
ShippingAddress.belongsTo(User);
//4--> Carrito - Producto
PurchaseCart.hasMany(Product);
Product.belongsTo(PurchaseCart);
//6--> Direccion de envio - Orden de compra
ShippingAddress.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(ShippingAddress);
//7--> Metodo de Pago - Orden de Compra
PaymentMethod.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(PaymentMethod);
//8--> Orden de compra - Detalle de compra
PurchaseOrder.hasMany(PurchaseDetail);
PurchaseDetail.belongsTo(PurchaseOrder);
//9--> Producto - Detalle de compra
Product.hasMany(PurchaseDetail);
PurchaseDetail.belongsTo(Product);
//10--> Usuario - Review
User.hasMany(Review);
Review.belongsTo(User);
//11--> Review - Product
Product.hasMany(Review);
Review.belongsTo(Product);
//12--> Carrito - Orden de compra
PurchaseCart.hasOne(PurchaseOrder);
PurchaseOrder.belongsTo(PurchaseCart);
// Establecemos la relación con el modelo de Producto
Product.hasMany(StockMovement);
StockMovement.belongsTo(Product);
// User.login=(email,password)=>{
//    //Buscar usuario bueno no puede ser mas chico xd
//    return User.findOne({
//      where:{
//        email
//      }
//    }).then(user=>{
//      if(!user)return null
//      return user.authenticatePassword(password).then(valid=>valid?user:null)
//    })
//  }
//  User.prototype.authenticatePassword = function(password){
//      return new Promise((res,rej)=>{
//        bcrypt.compare(password,this.password_hash,function(err,valid){
//          if(err) return rej(err)
//          res(valid)
//        })
//      })
//  }

// User.beforeCreate((user,options)=>{
//    return new Promise((resolve,reject)=>{
//       if(user.password){
//          bcrypt.hash(user.password,10,(error,hash)=>{
//             user.password_hash = hash;
//             resolve()
//          })
//       }
//    })
// })
module.exports = {
   ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
   conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};