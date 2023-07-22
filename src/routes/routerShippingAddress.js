const {Router}=require('express')
const { getAllAddress, newAddress, getAddressById, updateAddress, deleteAddress } = require('../controllers/ShippingAddress.Controller')


const router=Router()

router.route('/shippingAddress').get(getAllAddress).post(newAddress)

router.route('/shippingAddress/:id').get(getAddressById).put(updateAddress).delete(deleteAddress)


module.exports=router