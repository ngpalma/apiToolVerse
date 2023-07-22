const {Router}=require('express')
const { getAllPaymentMethod, createPaymentMethod, getPaymentMethodById } = require('../controllers/PaymentMethod.controller')

const router=Router()

router.route('/paymentMethod').get(getAllPaymentMethod).post(createPaymentMethod)

router.route('/paymentMethod/:id').get(getPaymentMethodById)


module.exports=router