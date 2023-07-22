const { Product, StockMovement } = require("../db");

const registrarEntrada = async (req, res) => {
  const { productId, quantity } = req.params;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    product.stock += parseInt(quantity);
    await product.save();

    await StockMovement.create({
      type: 'entrada',
      quantity: parseInt(quantity),
      productId: productId,
    });

    console.log('Entrada de stock registrada correctamente.');
    return res.status(200).json(product);

  } catch (error) {
    console.error('Error al registrar la entrada de stock:', error.message);
    return res.status(500).json({ error: 'Error al registrar la entrada de stock' });
  }
};

// Controlador para registrar una salida de stock para un producto específico


const registrarSalida = async (req, res) => {
  const { productId, quantity } = req.params;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    if (product.stock < parseInt(quantity)) {
      return res.status(400).json({ error: 'Stock insuficiente para realizar la salida' });
    }

    product.stock -= parseInt(quantity);
    await product.save();

    await StockMovement.create({
      type: 'salida',
      quantity: parseInt(quantity),
      productId: productId,
    });

    console.log('Salida de stock registrada correctamente.');
    return res.status(200).json(product);

  } catch (error) {
    console.error('Error al registrar la salida de stock:', error.message);
    return res.status(500).json({ error: 'Error al registrar la salida de stock' });
  }
};

module.exports = {
  registrarEntrada,
  registrarSalida,
};
