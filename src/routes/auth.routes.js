const {Router} =require('express')
const { register, login, logout, profile, verifyToken } = require('../controllers/auth.controller')
const { authRequired } = require('../middlewares/validateToken')

const router =Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get("/verify", verifyToken)

router.get("/profile",authRequired, profile)

module.exports = router