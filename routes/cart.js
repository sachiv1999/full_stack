const express= require('express');
const router= express.Router();
const jwt = require('jsonwebtoken');
const {userCart} = require('../controllers/cart.controller')

router.get('/userCart',userCart);

module.exports = router;