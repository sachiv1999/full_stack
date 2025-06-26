const jwt= require('jsonwebtoken')
const {Cart} = require('./model/Cart')
const {User} = require('./model/User')
const {Product} = require('./model/Product')

const cart= async(req,res)=>{
    try{
        const{token} = req.headers;
        const decodedToken = jwt.verify(token, "supersecret");
        const user = await User.find({email:decodedToken.email}).populate({
            path:'cart',
            populate:{
                path:'products',
                model:'Product'
            }
        })

        if(!user){
            res.status(400).json({
                msg:"user not found"
            })
        }

        res.status(200).json({
            msg:"message product add",
            cart:User.cart
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            msg:"internal server error"
        })
    }
}