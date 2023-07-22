const {PurchaseDetail, PurchaseOrder, Product} = require('../db');

const getAllPurchaseDetail = async (req, res) => {
      try{
        const detail  = await PurchaseDetail.findAll({
             include:[
                     {model: PurchaseOrder},
                     {model: Product}
             ],
        });
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
       res.json(detail); 

      }catch(error){
        res.status(404).json({error: "Purchase Detail not found"});
      }
};

const createPurchaseDetail = async (req, res) =>{
      try{
          const {purchaseOrderId, productId, quantity, price} = req.body;

          const detail = await PurchaseDetail.create({
            purchaseOrderId, productId, quantity, price
          });
          res.json(detail);

      }catch(error){
         res.status(404).json({ error: error.message });
      } 
};

const deletePurchaseDetail = async (req, res) => {
      try{
        const {id} = req.params;
        await PurchaseDetail.destroy({
                         where:{id:id}
        });
        res.json({success:true});

      }catch(error){
        res.status(404).json({error:error.message});
      }
};

module.exports={
    getAllPurchaseDetail,
    getPurchaseDetailById,
    createPurchaseDetail,
    deletePurchaseDetail
};