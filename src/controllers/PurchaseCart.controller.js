const {PurchaseCart,User}=require('../db')

const getAllPurchaseCart=async(req,res)=>{
    try {
        const purchase=await PurchaseCart.findAll()
        res.json(purchase)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


const getPurchaseCartId=async(req,res)=>{
    try {
        const purchase=await PurchaseCart.findByPk(req.params.id)
        res.json(purchase)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

const createPurchaseCart = async (req, res) => {
    try {
      const { quantity,userId } = req.body;
      const purchase = await PurchaseCart.create({quantity,userId});
      res.json(purchase);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  const deletePurchaseCart=async(req,res)=>{
    try {
        const purchase=await PurchaseCart.findByPk(req.params.id)
        await purchase.destroy()
        res.json({success:true})
    } catch (error) {
        res.status(404).json({error:error.message})
    }
  }

  module.exports={
    getAllPurchaseCart,
    getPurchaseCartId,
    createPurchaseCart,
    deletePurchaseCart
  }
