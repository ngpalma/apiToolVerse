const {PaymentMethod}=require('../db')


// Función para cargar valores permitidos en la tabla "paymentMethods"
const loadPaymentMethods = async () => {
  const paymentMethods = ["Mercado Pago", "Paypal"];

  for (const method of paymentMethods) {
    await PaymentMethod.findOrCreate({
      where: { name: method },
      defaults: { name: method },
    });
  }
};

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

//Para crear un nuevo metodo de pago
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
    loadPaymentMethods
  }
