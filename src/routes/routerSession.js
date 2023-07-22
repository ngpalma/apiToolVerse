const {Router}=require('express')
const sessionController=require('../controllers/sessions.Contoller')
const router=Router()

router.route('/sessions').get(sessionController.new).post(sessionController.create).delete(sessionController.destroy)

module.exports=router