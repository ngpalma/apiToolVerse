const {Router} = require("express")
const {getCategory} = require("../controllers/category.controller")

const router = Router()

router.get("/category", getCategory)

module.exports = router;