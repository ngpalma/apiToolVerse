const {PurchaseOrder, PurchaseCart, User, ShippingAddress, PaymentMethod} = require('../db');

const getAllPurchaseOrder = async (req, res) =>{
         try{
            const orders = await PurchaseOrder.findAll({
                 include:[
                         {model: PurchaseCart},
                         {model: User},
                         {model: ShippingAddress},
                         {model: PaymentMethod}   
                 ],
            });
            res.json(orders)

         }catch(error){
            res.status(404).json({error: "Purchase Orders not found"});
         }
};

const getPurchaseOrderById = async (req, res)=>{
          try{
            const {id} = req.params;
            const order = await PurchaseOrder.findOne({
                where :{ id: id },
                include:[
                      {model: PurchaseCart},
                      {model: User},
                      {model: ShippingAddress},
                      {model: PaymentMethod} 
                ],
            });
          res.json(order);

          }catch(error){
            res.status(404).json({error: "Purchase Orders not found"});
          }
};

const createPurchaseOrder = async (req, res) => {
    try{
       const {userId, shippingAddressId, paymentMethodId, total} = req.body;

       const order = await PurchaseOrder.create({userId, shippingAddressId, paymentMethodId, total});

       res.json(order);

    }catch(error){
        res.status(404).json({ error: error.message });
    }
};


const deletePurchaseOrder = async (req, res) => {
      try{
         const {id} = req.params;
         await PurchaseOrder.destroy({
                           where: {id:id}
             }); 
        res.json({success:true});
        
      }catch(error){
        res.status(404).json({ error: error.message });
      }
};


module.exports = {
    getAllPurchaseOrder,
    getPurchaseOrderById,
    createPurchaseOrder,
    deletePurchaseOrder
};