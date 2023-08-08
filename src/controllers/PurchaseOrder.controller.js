const { PurchaseOrder, PurchaseCart, User, ShippingAddress, PaymentMethod } = require('../db');

const getAllPurchaseOrder = async (req, res) => {
  try {
    const orders = await PurchaseOrder.findAll({
      include: [
        { model: PurchaseCart },
        { model: User },
        { model: ShippingAddress },
        { model: PaymentMethod }
      ],
    });
    res.json(orders)

  } catch (error) {
    res.status(404).json({ error: "Purchase Orders not found" });
  }
};

const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PurchaseOrder.findOne({
      where: { id: id },
      include: [
        { model: PurchaseCart },
        { model: User },
        { model: ShippingAddress },
        { model: PaymentMethod }
      ],
    });

    if (!order) {
      // Si order es null (no se encontró ninguna orden con el ID dado)
      return res.status(404).json({ error: "ID not exist" });
    }

    res.json(order);

  } catch (error) {
    res.status(404).json({ error: "Purchase Orders not found" });
  }
};

const createPurchaseOrder = async (req, res) => {
  try {
    const { userId, purchaseCartId, shippingAddressId, paymentMethodId, total } = req.body;
    console.log('el back recibe la info', 'userId', userId, 'purchaseCartId', purchaseCartId, 'shippingAddressId', shippingAddressId, 'paymenttMethodId', paymentMethodId, 'total', total)

    const order = await PurchaseOrder.create({ userId, purchaseCartId, shippingAddressId, paymentMethodId, total });

    console.log('lo que acaba de crear el back', order)

    res.status(200).json(order);

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await PurchaseOrder.destroy({
      where: { id: id }
    });
    res.json({ message: 'Purchase Order deleted successfully' });

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, purchaseCartId, shippingAddressId, paymentMethodId, total } = req.body;

    // Verificar si la orden de compra existe en la base de datos
    const order = await PurchaseOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Purchase Order not exist' });
    }

    // Actualizar los datos de la orden de compra
    order.userId = userId;
    order.purchaseCartId = purchaseCartId;
    order.shippingAddressId = shippingAddressId;
    order.paymentMethodId = paymentMethodId;
    order.total = total;
    await order.save();

    // Responder con los datos actualizados de la orden de compra
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating Purchase Order' });
  }
};

module.exports = {
  getAllPurchaseOrder,
  getPurchaseOrderById,
  createPurchaseOrder,
  deletePurchaseOrder,
  updatePurchaseOrder
};