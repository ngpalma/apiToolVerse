const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
require('./db.js');
const cookieParser =require('cookie-parser');
const server = express();
const mercadopago = require("mercadopago")
server.name = 'API';
const cors = require('cors')
// var corsOptions = {
//    origin: false 
// }



const allowedOrigins = ['https://clienttoolverse-production.up.railway.app', 'https://clienttoolverse-production.up.railway.app/',"http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};

server.use(cors(corsOptions));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(morgan('dev'));
server.use(cookieParser())

server.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", {origin: "*"}); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  next();
});

server.use(routes);



// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
