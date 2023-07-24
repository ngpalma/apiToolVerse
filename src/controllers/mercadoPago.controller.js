const mercadopago = require('mercadopago')

mercadopago.configure({access_token: process.env.PROD_ACCESS_TOKEN})

const createPayment = (req, res) => {
const tool = req.body;


// Crea un objeto de preferencia
let preference = {
    items: [],
    
    back_urls: {
        success: 'http://localhost:3000/home',
        failure: 'http://localhost:3000/error',
        pending: 'http://localhost:3000/home',
    },
    auto_return: 'approved',
    binary_mode: true,
  };
  
  tool.map((e)=> preference.items.push({
    // id: e.id,
    title: e.name,
    // currency_id: 'ARS',
    // picture_url: e.image,
    // description: e.model,
    // category_id: 'art',
    unit_price: e.price,
    quantity: e.quantity,
})

);
  
  mercadopago.preferences
    .create(preference)
    .then((response) => res.status(200).send({response}))
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = { createPayment };
