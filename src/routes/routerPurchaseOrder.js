const {Router}=require('express')
const { getAllPurchaseOrder, createPurchaseOrder, getPurchaseOrderById, deletePurchaseOrder } = require('../controllers/PurchaseOrder.controller')


const router=Router()

router.route('/purchaseOrder').get(getAllPurchaseOrder).post(createPurchaseOrder)

router.route('/purchaseOrder/:id').get(getPurchaseOrderById).delete(deletePurchaseOrder)

module.exports=router