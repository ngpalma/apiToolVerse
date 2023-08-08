require("dotenv").config()
const {Category} = require("../db")

const getCategory = async (req, res) => {
try {
    const category = await Category.findAll()
    return res.status(200).json(category)
} catch (error) {
    res.status(404).json({error:"Category not found"})
}
}

module.exports = {
    getCategory
}