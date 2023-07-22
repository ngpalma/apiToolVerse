const { Router } = require('express');
const {registrarEntrada, registrarSalida} =require("../controllers/StockMovement.controller");

const router = Router();

// Ruta para registrar una entrada de stock
router.post('/stock/entrada/:productId/:quantity', registrarEntrada);

// Ruta para registrar una salida de stock
router.post('/stock/salida/:productId/:quantity', registrarSalida);

module.exports = router;

