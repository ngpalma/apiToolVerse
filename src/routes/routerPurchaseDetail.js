const {Router}=require('express')
const {getAllPurchaseDetail, getPurchaseDetailById, createPurchaseDetail, deletePurchaseDetail, updatePurchaseDetail} = require('../controllers/PurchaseDetail.controller')

const router=Router()

router.route('/purchaseDetail').get(getAllPurchaseDetail).post(createPurchaseDetail)

router.route('/purchaseDetail/:id').get(getPurchaseDetailById).delete(deletePurchaseDetail).put(updatePurchaseDetail)

module.exports=router