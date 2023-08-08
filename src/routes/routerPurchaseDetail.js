const { Router } = require('express')
const { getAllPurchaseDetail, getPurchaseDetailById, getPurchaseDetailByPurchaseCartId, createPurchaseDetail, deletePurchaseDetail, updatePurchaseDetail } = require('../controllers/PurchaseDetail.controller')

const router = Router()

router.route('/purchaseDetail/purchaseCartId/:id').get(getPurchaseDetailByPurchaseCartId)

router.route('/purchaseDetail/:id').get(getPurchaseDetailById).delete(deletePurchaseDetail).put(updatePurchaseDetail)

router.route('/purchaseDetail').get(getAllPurchaseDetail).post(createPurchaseDetail)

module.exports = router