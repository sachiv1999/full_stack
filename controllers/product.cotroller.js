const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const {Product}=require('../model/Product')
const {User}= require('../model/User')

const Products =async(req,res)=>{
    try{
        const product= await Product.find({});

        return res.status(200).json({
            message:"all products",
            product:product
        })
    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"internal server error"
        })
    }
}

const addproduct= async(req,res)=>{
    try{
        let {name,image,price,brand,stock,description} = req.body;
        let  {token} = req.headers;
        let decodedToken = jwt.verify(token,"supersecret");
        let user = await User.find({email:decodedToken.email});
        const product= await Product.create({
            name,
            price,
            image,
            brand,
            stock,
            description,
            user : user._id

        })
        return res.status(200).json({
            message:"product create successfully",
            product:product
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"internal server error"
        })
    }
}

const singleProduct =async(req,res)=>{
    try{
        let {id} = req.params;
        if(!id){
            return res.status(400).json({
                msg:"product id not found"
            })
        }

        let{token}= req.headers;
        const decodedToken= jwt.verify(token,"supersecret")
        const user=await User.find({email:decodedToken.email});

        if(user){
            const product= await Product.findById(id);
            if(!product){
                res.status(400).json({
                    msg:"produc t not found"
                })
            }

            return res.status(200).json({
                msg:"product found suucessfully",
                Product:product
            })
        }

    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"internal server error"
        })
    }
}

const updateProduct = async(req,res)=>{
    try{
        let {id} = req.params;
        if(!id){
            return res.status(400).json({
                msg:"product id not found"
            })
        }
        let {name,price,image,stock,brand,description} = req.body;
        let {token}= req.headers;

        let decodedToken =jwt.verify(token,"supersecret");
        let user=await User.find({email:decodedToken.email});

        if(user){
            const productUpdated = await Product.findByIdAndUpdate(id,{
                name,
                price,
                image,
                brand,
                stock,
                description
            });
            return res.status(200).json({
                msg:"product update successfully"
                ,product:productUpdated
            })
        }

    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"internal server error"
        })
    }
}

const deleteProduct= async(req,res)=>{
    try {
        let {id} = req.params;
        if(!id){
            return res.status(400).json({
                msg:"product id not found"
            })
        }
        let {token}= req.headers;

        let decodedToken =jwt.verify(token,"supersecret");
        let user=await User.find({email:decodedToken.email});

        if(user){
            const productDelete = await Product.findByIdAndDelete(id);
            return res.status(200).json({
                msg:"product delete successfully"
                ,product:productDelete
            })
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"internal server error"
        })
    }
}
module.exports ={Products,addproduct,singleProduct,updateProduct, deleteProduct};