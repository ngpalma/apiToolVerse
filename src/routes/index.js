const { Router } = require('express');
const routerProduct=require('./routerProduct')
const routerShippingAddress=require('./routerShippingAddress')
const routerPaymentMethod=require('./routerPaymentMethod')
const routerPurchaseCart=require('./routerPurchaseCart')
const routerPurchaseOrder=require('./routerPurchaseOrder')
const routerReview=require('./routerReview')
const routerAuth=require('./auth.routes')
const routerTasks=require('./router.Tasks')
const routerStock=require('./router.stock')
const routerUser=require('./routerUser')
const routerPurchaseDetail=require('./routerPurchaseDetail')
const routerMercadoPago=require('./routerMercadoPago')
const routerCategory=require("./routeCategory")


const router = Router();

router.use(routerAuth)
router.use(routerProduct)
router.use(routerShippingAddress)
router.use(routerPaymentMethod)
router.use(routerPurchaseCart)
router.use(routerPurchaseOrder)
router.use(routerReview)
router.use(routerTasks)
router.use(routerStock)
router.use(routerUser)
router.use(routerPurchaseDetail)
router.use(routerMercadoPago)
router.use(routerCategory)



module.exports = router;
