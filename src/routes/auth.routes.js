const {Router} =require('express')
const { register, login, logout, profile, verifyToken, forgotPassword, resetPassword, contactUs } = require('../controllers/auth.controller')
const { authRequired } = require('../middlewares/validateToken')

const router =Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/forgotPassword',forgotPassword)
router.post('/resetPassword/:token',resetPassword)
router.post('/contactUs',contactUs)

router.get("/verify", verifyToken)

router.get("/profile",authRequired, profile)


module.exports = router