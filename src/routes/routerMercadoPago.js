const {Router}=require('express')
const {createPayment} = require('../controllers/mercadoPago.controller')

const router=Router()

router.post('/payment', createPayment)

module.exports=router
