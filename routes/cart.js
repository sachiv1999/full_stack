const express= require('express');
const router= express.Router();
//const jwt = require('jsonwebtoken');
const {cart,addCart,paymentCart} = require('../controllers/cart.controller')

router.get('/userCart',cart);
router.post('/addtocart',addCart);
router.put('/updateCart',updateCart);
router.post('/payment',paymentCart);

module.exports = router;