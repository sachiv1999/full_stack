const express= require('express');
const { addproduct, singleProduct, Products, updateProduct, deleteProduct } = require('../controllers/product.cotroller');
const router= express.Router();


//take one see all product

router.get('/product',Products);

//task2: add product
router.post("/addproduct",addproduct);

//task3: single product
router.get('/singleproduct/:id',singleProduct);


//task-4 -> update product
router.put('/edit/:id',updateProduct);

//task:5 -> delete product
router.delete("/delete/:id",deleteProduct);
module.exports= router;