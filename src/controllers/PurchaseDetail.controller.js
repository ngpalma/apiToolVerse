const { PurchaseDetail, Product, PurchaseCart } = require('../db');

const getAllPurchaseDetail = async (req, res) => {
  try {
    const detail = await PurchaseDetail.findAll({
      include: [
        { model: Product },
        { model: PurchaseCart }
      ],
    });
    if (!detail) {
      return res.status(404).json({ error: "No purchase details" });
    }

    res.json(detail);

  } catch (error) {
    res.status(404).json({ error: "Purchase Detail not found" });
  }
};

const getPurchaseDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await PurchaseDetail.findOne({
      where: { id: id },
      include: [
        { model: Product },
        { model: PurchaseCart }
      ],
    });

    if (!detail) {
      return res.status(404).json({ error: "Detail not exist" });
    }

    res.json(detail);

  } catch (error) {
    res.status(404).json({ error: "Purchase Detail not found" });
  }
};

const createPurchaseDetail = async (req, res) => {
  try {
    const { productId, quantity, purchaseCartId } = req.body;

    // Verificar si se proporcionan todos los atributos requeridos
    if (!productId || !quantity || !purchaseCartId) {
      return res.status(400).json({ error: "All attributes are required" });
    }

    // Verificar si el carrito existe
    const purchaseCart = await PurchaseCart.findOne({
      where: { id: purchaseCartId },
    });

    if (!purchaseCart) {
      return res.status(404).json({ error: "Purchase Cart not found" });
    }

    // Verificar si ya existe un detalle de compra para el producto en el carrito
    const existingDetail = await PurchaseDetail.findOne({
      where: { purchaseCartId, productId },
    });

    if (existingDetail) {
      // Si el detalle ya existe, devolvemos un mensaje indicando que ya está en el carrito
      return res.status(200).json({ message: "Product already in the cart" });
    } else {
      // Si el detalle no existe, creamos un nuevo detalle
      const createdDetail = await PurchaseDetail.create({
        purchaseCartId,
        productId,
        quantity,
      });
      return res.status(201).json(createdDetail);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePurchaseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    await PurchaseDetail.destroy({
      where: { id: id }
    });
    return res.status(200).json({ message: 'Purchase Detail deleted successfully' });

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getPurchaseDetailByPurchaseCartId = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await PurchaseDetail.findAll({
      where: { purchaseCartId: id },
      include: [
        { model: Product },
        { model: PurchaseCart }
      ],
    });

    if (!detail) {
      return res.status(404).json({ error: "Detail not exist" });
    }

    res.status(200).json(detail);

  } catch (error) {
    console.error('id de params', id, 'Error en getPurchaseDetailByPurchaseCartId del back', error)
    res.status(400).json({ error: "Purchase Detail not found" });
  }
}


const updatePurchaseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, purchaseCartId } = req.body;

    // Verificar si el detalle de compra existe en la base de datos
    const purchaseDetail = await PurchaseDetail.findByPk(id);
    if (!purchaseDetail) {
      return res.status(404).json({ message: 'Purchase Detail not exist' });
    }

    // Verificar si el Carrito existe
    const purchaseCart = await PurchaseCart.findOne({
      where: { id: purchaseCartId },
    });
    if (!purchaseCart) {
      return res.status(404).json({ error: 'Purchase Cart not exist' });
    }

    // Verificar si el producto existe
    const product = await Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Actualizar los datos del detalle de compra
    purchaseCart.purchaseCartId = purchaseCartId;
    purchaseDetail.productId = productId;
    purchaseDetail.quantity = quantity;
    await purchaseDetail.save();

    return res.status(200).json(purchaseDetail);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating Purchase Detail' });
  }
};


module.exports = {
  getAllPurchaseDetail,
  getPurchaseDetailById,
  getPurchaseDetailByPurchaseCartId,
  createPurchaseDetail,
  deletePurchaseDetail,
  updatePurchaseDetail
};