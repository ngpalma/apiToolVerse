const {PaymentMethod}=require('../db')


const getAllPaymentMethod=async(req,res)=>{
    try {
        const payment=await PaymentMethod.findAll()
        res.json(payment)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


const getPaymentMethodById=async(req,res)=>{
    try {
        const payment=await PaymentMethod.findByPk(req.params.id)
        res.json(payment)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

const createPaymentMethod = async (req, res) => {
    try {
      const { name } = req.body;
      const [payment, created] = await PaymentMethod.findOrCreate({
        where: { name },
        defaults: { name }
      });
  
      res.json(payment);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };


  module.exports={
    getAllPaymentMethod,
    getPaymentMethodById,
    createPaymentMethod,
  }
