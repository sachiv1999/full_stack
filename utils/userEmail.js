const nodemailer = require('nodemailer');
const { Product } = require('../model/Product');

const sendEmail = async(userEmail,productArray)=>{
    
    const transpoter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: process.env.Node_Email,
            pass: process.env.Node_Pass,
        }
    })

    const productDetails = productArray.map((product,index)=>{
        `${index+1}.Name: ${product.name}.Price:${product.price}`
    })
    //setup mail content
    const mailOptions= { from:process.env.Node_Email,
        to:userEmail,
        subject:"you order details",
        text:"thanks for your purchase! \n\n here is your product details"
    }

    try{
        await transpoter.sendMail(mailOptions);

    }catch(error){
        console.log(e);
    }



}

module.exports= sendEmail;