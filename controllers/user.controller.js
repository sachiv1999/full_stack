const {User} = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

const signup = async(req,res)=>{
    try{
        let{name,email,password} = req.body;
        if(!name || !email || !password){
            res.status(400).json({
                message:"some field are missing"
            })
        }

        const isUserAlreadyExist = await User.findOne({email});

        if(isUserAlreadyExist){
            return res.status(400).json({
                message:"User already exist"
            })
        }

        //hash the password
        const salt= bcrypt.genSaltSync(10);
        const passwordHashed= bcrypt.hashSync(password,salt);

        //jwt token
        const token= jwt.sign({email},"supersecret",{expiresIn:'365d'});

        //create user in database
        await User.create({
            name,
            email,
            password:passwordHashed,
            token,
            role:'user'

        })
        res.status(200).json({
            msessage:"USer created successfully"
        })

    }catch(error){
        console.log(error);
        res.status(404).json({
            message:"internal server error"
        })
    }
}

const login= async(req,res)=>{
    try{
        let {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"some field missing"
            })
        }

        let user=await User.findOne({email});
        if(!user){
            res.status(400).json({
                message:"user not register"
            })
        }

        //comper password
        const isPasswordMatched= bcrypt.compareSync(password,user.password);
        if(!isPasswordMatched){
            res.status(404).json({
                message:"password worng"
            })
        }

        res.status(200).json({
            message:"user login successfully",
            id:user._id,
            name:user.name,
            token:user.token,
            email:user.email,
            role:user.role
        })

        

    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"internal server error"
        })
    }

}

module.exports ={signup, login};