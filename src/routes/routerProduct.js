const { Router } = require('express');
const {getAllProducts, getProductById, getProductByName, createProducts, updateProduct, deleteProduct} =require("../controllers/Product.controller");


const router = Router();

/* ----------------------------------- */
/* Products                         */
/* ----------------------------------- */

router.get("/products", (req, res) => {
    if(req.query.name) getProductByName(req, res)
    else getAllProducts(req, res)
});

router.get("/products/:id", getProductById);
router.post("/products", createProducts);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;

