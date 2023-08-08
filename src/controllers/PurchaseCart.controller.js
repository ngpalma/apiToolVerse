const { PurchaseCart, User } = require('../db')

const getAllPurchaseCart = async (req, res) => {
  try {
    const purchaseAll = await PurchaseCart.findAll()
    return res.status(201).json(purchaseAll)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}


const getPurchaseCartId = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseID = await PurchaseCart.findByPk(id)
    return res.status(201).json(purchaseID)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

const createPurchaseCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const purchase = await PurchaseCart.create({
      userId: userId,
    });
    return res.status(201).json(purchase);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


const deletePurchaseCart = async (req, res) => {
  try {
    const purchaseID = req.params.id;
    const purchase = await PurchaseCart.findByPk(purchaseID);

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    //Si existe se Elimina
    await purchase.destroy()
    return res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting purchase' });
  }
}

const updatePurchaseCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, userId } = req.body;

    // Verificar si la compra existe en la base de datos
    const purchase = await PurchaseCart.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // Actualizar los datos de la compra
    purchase.quantity = quantity;
    purchase.userId = userId;
    await purchase.save();

    // Responder con los datos actualizados de la compra
    return res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating purchase' });
  }
};

module.exports = {
  getAllPurchaseCart,
  getPurchaseCartId,
  createPurchaseCart,
  deletePurchaseCart,
  updatePurchaseCart
}
