require("dotenv").config();
const {Product} = require("../db");
const {Op, literal} = require("sequelize");

/* ----------------------------------- */
/* GET ENDPOINTS                       */
/* ----------------------------------- */

const getAllProducts = async(req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);
    } catch (error) {
        res.status(404).json({error: "Products not found"});
    }
};

const getProductById = async(req, res) => {

    const {id} = req.params;

    try {
        const product = await Product.findByPk(id);
        res.status(200).json(product);
        
    } catch (error) {
        res.status(404).json({error: "Product not found"});
    }
};

const getProductByName = async(req, res) => {

    const {name} = req.query;

try {
    const searchValues = name.split(" ");

    const whereClause = searchValues.map(searchValue => ({
        [Op.or]: [
            {
                name: {
                    [Op.iLike]: `%${searchValue}%`
                }
            },
            {
                brand: {
                    [Op.iLike]: `%${searchValue}%`
                }
            }
        ]
    }));

    const product = await Product.findAll({
        where: {
            [Op.and]: whereClause
        },
    });
    res.status(200).json(product)

} catch (error) {
    res.status(404).json({error: "Product not found"});
}
};
  

//POST
const createProducts = async (req, res) => {
        try {
          const data = req.body;
      
          if (!data) {
            // Si no se proporciona ningún dato en el cuerpo de la solicitud.
            return res.status(400).json({ error: 'Data not provided' });
          }

            // Validar que los atributos no estén vacíos.
        for (const key in data) {
        if (data[key] === null || data[key] === undefined || data[key] === '') {
          return res.status(400).json({ error: `Attribute '${key}' cannot be empty` });
        }
      }
      
          // Si se envía un arreglo de objetos, crearemos varios productos a la vez.
          if (Array.isArray(data)) {
            const createdProducts = await Product.bulkCreate(data);
            return res.status(201).json(createdProducts);
          } else {
            // Si se envía un solo objeto, crearemos un solo producto.
            const createdProduct = await Product.create(data);
            return res.status(201).json(createdProduct);
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error creating product(s)' });
        }
      };
      

//PUT
const updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const data = req.body;
  
      if (!data) {
        // Si no se proporciona ningún dato en el cuerpo de la solicitud.
        return res.status(400).json({ error: 'Data not provided' });
      }
  
      // Validar que los atributos no estén vacíos.
      for (const key in data) {
        if (data[key] === null || data[key] === undefined || data[key] === '') {
          return res.status(400).json({ error: `Attribute '${key}' cannot be empty` });
        }
      }
  
      // Buscar el producto por su ID.
      const product = await Product.findByPk(productId);
  
      if (!product) {
        // Si no se encuentra el producto con el ID proporcionado.
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Actualizar los atributos del producto con los nuevos datos.
      await product.update(data);
  
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating product' });
    }
  };
  


module.exports = {
    getAllProducts,
    getProductById,
    getProductByName,
    createProducts,
    updateProduct
};






/* ----------------------------------- */
/* POST ENDPOINTS                       */
/* ----------------------------------- */

// const createOneProduct = async (obj) => {
//     try {
//         const product = await Product.findOrCreate({
//             where: {
//                 brand: obj.brand,
//                 name: obj.name,
//                 model: obj.model,
//                 feature: obj.feature,
//                 detail: obj.detail,
//                 price: obj.price,
//                 image: obj.image,
//                 stock: obj.stock,
//                 category: obj.category
//             }
//         });
//         return product;
//     } catch (error) {
//         throw error;
//     }
// };


// const createProducts = async(req, res) => {
//     const products = req.body;

//     try {
//         if(!products) throw new Error("Not products available");
//         if(!Array.isArray(products) && !(typeof products === "object" && products !== null)) throw new Error("products must be of type array or of type object");

//         const validateObject = (obj) => {
//             const modelObj = {
//                 brand: "string",
//                 name: "string",
//                 model: "string",
//                 feature: "string",
//                 detail: "string",
//                 price: "number",
//                 image: "string",
//                 stock: "number",
//                 category: "array"
//             };
//             const errors = [];

//             for(const prop in modelObj) {
//                 if(!obj.hasOwnProperty(prop)) {
//                     errors.push(`Falta la propiedad "${prop}".`);
//                 }else if (typeof obj[prop] !== modelObj[prop]) {
//                     errors.push(`La propiedad "${prop}" tiene un tipo invalido. Se esperaba "${modelObj[prop]}", se recibio "${typeof obj[prop]}".`);
//                 }
//             }
//         if(errors.length > 0) throw new Error(errors.join("\n"));
//         }

//         if(Array.isArray(products)){
//             products.forEach(el => {
//                 validateObject(el);
//             });
//             for(let i = 0; i < products.length; i++){
//                 await createOneProduct(products[i]);
//             }
//             res.status(200).send("Productos creados exitosamente");
//         }
//         else if(typeof products === "object" && products !== null){
//             validateObject(products);
//             await createOneProduct(products);
//             res.status(200).send("producto creado exitosamente");
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// };