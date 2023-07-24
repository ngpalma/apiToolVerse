const {Router}=require('express')
const { getAllPurchaseOrder, createPurchaseOrder, getPurchaseOrderById, deletePurchaseOrder, updatePurchaseOrder } = require('../controllers/PurchaseOrder.controller')


const router=Router()

router.route('/purchaseOrder').get(getAllPurchaseOrder).post(createPurchaseOrder)

router.route('/purchaseOrder/:id').get(getPurchaseOrderById).delete(deletePurchaseOrder).put(updatePurchaseOrder)

module.exports=router