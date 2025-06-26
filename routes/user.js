const express= require('express');
const { signup ,login} = require('../controllers/user.controller');
const router= express.Router();


//sign up
router.post('/register',signup);

//login
router.post('/login',login);

module.exports= router;