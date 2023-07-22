const {Router}=require('express')
const { getAllPurchaseCart, createPurchaseCart, getPurchaseCartId, deletePurchaseCart } = require('../controllers/PurchaseCart.controller')

const router=Router()

router.route('/purchaseCart').get(getAllPurchaseCart).post(createPurchaseCart)

router.route('/purchaseCart/:id').get(getPurchaseCartId).delete(deletePurchaseCart)

module.exports=router