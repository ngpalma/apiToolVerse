const {PurchaseDetail, PurchaseOrder, Product} = require('../db');

const getAllPurchaseDetail = async (req, res) => {
      try{
        const detail  = await PurchaseDetail.findAll({
             include:[
                     {model: PurchaseOrder},
                     {model: Product}
             ],
        });
        if (!detail) {
          return res.status(404).json({ error: "No purchase details" });
        }
    
        res.json(detail);

      }catch(error){
        res.status(404).json({error: "Purchase Detail not found"});
      } 
};

const getPurchaseDetailById = async (req, res) => {
      try{
        const {id} = req.params;
        const detail = await PurchaseDetail.findOne({
            where:{id:id},
            include: [
                {model: PurchaseOrder},
                {model: Product}
            ],
        });

        if (!detail) {
          return res.status(404).json({ error: "Detail not exist" });
        }
    
       res.json(detail); 

      }catch(error){
        res.status(404).json({error: "Purchase Detail not found"});
      }
};

const createPurchaseDetail = async (req, res) => {
  try {
    const { purchaseOrderId, productId, quantity, price } = req.body;

    // Verificar si se proporcionan todos los atributos requeridos
    if (!purchaseOrderId || !productId || !quantity || !price) {
      return res.status(400).json({ error: "All attributes are required" });
    }

    // Verificar si la orden de compra existe
    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id: purchaseOrderId },
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase Order not found" });
    }

    // Si la orden de compra existe, crear el detalle de compra
    const createdDetail = await PurchaseDetail.create({
      purchaseOrderId,
      productId,
      quantity,
      price,
    });

    return res.status(201).json(createdDetail);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePurchaseDetail = async (req, res) => {
      try{
        const {id} = req.params;
        await PurchaseDetail.destroy({
                         where:{id:id}
        });
        return res.status(200).json({ message: 'Purchase Detail deleted successfully' });

      }catch(error){
        res.status(404).json({error:error.message});
      }
};

const updatePurchaseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { purchaseOrderId, productId, quantity, price } = req.body;

    // Verificar si el detalle de compra existe en la base de datos
    const purchaseDetail = await PurchaseDetail.findByPk(id);
    if (!purchaseDetail) {
      return res.status(404).json({ message: 'Purchase Detail not exist' });
    }

    // Verificar si la orden de compra existe
    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id: purchaseOrderId },
    });
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase Order not exist' });
    }

    // Verificar si el producto existe
    const product = await Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Actualizar los datos del detalle de compra
    purchaseDetail.purchaseOrderId = purchaseOrderId;
    purchaseDetail.productId = productId;
    purchaseDetail.quantity = quantity;
    purchaseDetail.price = price;
    await purchaseDetail.save();

    return res.status(200).json(purchaseDetail);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating Purchase Detail' });
  }
};


module.exports={
    getAllPurchaseDetail,
    getPurchaseDetailById,
    createPurchaseDetail,
    deletePurchaseDetail,
    updatePurchaseDetail
};