const {Router}=require('express')
const {createPayment, feedbackPayment} = require('../controllers/mercadoPago.controller')

const router=Router()

router.post('/payment', createPayment)
router.get('/feedback', feedbackPayment)

module.exports=router
