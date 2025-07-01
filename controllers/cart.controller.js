const jwt = require('jsonwebtoken');
const {Cart} = require('../model/Cart')
const {User} = require('../model/User')
const {Product} = require('../model/Product')
const {populate} = require('dotenv')
const stripe = require('stripe')("sk_test_51Re71TQMfHelQmnjWEJeKL5ZiHUHR0DcWioM0G2R5rPC1v2f3SzdlNG0Ts0PS5oN3aCJWResJ2STA4ETXeLyQXJN00WbUPNxjD")
const sendEmail = require('../utils/userEmail')

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
            return res.status(400).json({
                msg:"user not found"
            })
        }

        res.status(200).json({
            msg:"message product add",
            cart:user.cart
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            msg:"internal server error"
        })
    }
}


const addCart = async (req, res) => {
    try {
      const { quantity, productId } = req.body;
  
      // 1. Validate input
      if (!quantity || !productId) {
        return res.status(400).json({ message: "Some fields are missing" });
      }
  
      // 2. Decode JWT token and find the user
      const { token } = req.headers;
      const decodedToken = jwt.verify(token, "supersecret");
      const user = await User.findOne({ email: decodedToken.email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
  
      // 3. Find product and check stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Out of Stock or insufficient quantity" });
      }
  
      let cart;
  
      // 4. Check if user already has a cart
      if (user.cart) {
        cart = await Cart.findById(user.cart);
  
        // If cart doesn't exist in DB, create new one
        if (!cart) {
          cart = await Cart.create({
            products: [{ product: productId, quantity }],
            total: product.price * quantity,
          });
  
          user.cart = cart._id;
          await user.save();
        } else {
          // Check if product is already in cart
          const exists = cart.products.some(
            (p) => p.product.toString() === productId.toString()
          );
  
          if (exists) {
            return res.status(409).json({ message: "Go to Cart" });
          }
  
          // Add new product to existing cart
          cart.products.push({ product: productId, quantity });
          cart.total += product.price * quantity;
          await cart.save();
        }
      } else {
        // 5. Create new cart if user has no cart
        cart = await Cart.create({
          products: [{ product: productId, quantity }],
          total: product.price * quantity,
        });
  
        user.cart = cart._id;
        await user.save();
      }
  
      // 6. Reduce product stock
      product.stock -= quantity;
      await product.save();
  
      res.status(200).json({ message: "Product added to cart" });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  

const updateCart= async(req,res)=>{
    try{
        const {productId,action}=req.body;
        const {token}=res.headers;
        
        const decodedToken= jwt.verify(token, 'supersecret');
        const user= await user.find({email:decodedToken.email}).populate({
            path:"cart",
            populate:{
                path:"products.product",
                model:"Product"
            }
        });

        if(!user || !user.cart){
            return res.status(400).json({
                msg:"cart not found"
            })
        }

        const cart=user.cart;
        const item= cart.products.find((p)=>p.product._id.toString()=== productId);

        if(!item){
            returnres.status(400).json({msg:"product not found"})
        }
        const totalPrice= item.product.price;

        //action to logic
        if(action === "increase"){
            item.quantity += 1;
            cart.total += totalPrice;
        }else if(action === "decrease"){
            if(item.quantity > 1){
                item.quantity -=1;
                cart.total -= totalPrice;
            }else{
                cart.total -= totalPrice
                cart.products = cart.products.filter(p=>p.product._id.toString() !== productId);
            }
        }else if(action === "remove"){
            cart.total -= totalPrice*item.quantity;
            cart.products =cart.products.filter(p => p.product._id.toString() !== productId);
        }
        else{
            return res.status(404).json({
                msg:"invalid action"
            })
        }
        await cart.save();
        res.status(200).json({
            msg:"cart updated",cart
        })
        return 

    }catch(error){
        console.log(error);
        res.status(400).json({
            msg:"internal server error"
        })
    }
}

const paymentCart = async(req,res)=>{
  try{
      const {token} = req.headers;
      const decodedToken = jwt.verify(token,"supersecret");
      const user = await User.findOne({email:decodedToken.email}).populate({
        path:'cart',
        populate:{
          path:"products.product",
          model:'Product'
        }
      })
      if(!user||!user.cart||user.cart.products.length ===0){
        res.status(404).json({message:"user or cart not found"})
      }

      //payment
      const lineItems = user.cart.products.map((item)=>{
          return {price_data:{
          currency:"inr",
          product_data:{
            name:item.product.name,
          },
          unit_amount: item.product.price*100,
        },
        quantity:item.quantity
      }})

      const curentUrl = process.env.CLIENT_URL;
      const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items: lineItems,
        mode:"payment",
        success_url:`${curentUrl}/success`,
        cancel_url:`${curentUrl}/cancel`
      })

      //send email to user
      await sendEmail(
        user.email,
        
        user.cart.products.map((item)=>({
          name:item.product.name,
          price:item.product.price
        }))
      )

      //empty cart
      user.cart.products=[];
      user.cart.total = 0;
      await user.cart.save();
      await user.save();
      res.status(200).json({
        message:"get the payment url",
        url:session.url

      })
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports= {cart,addCart,paymentCart}