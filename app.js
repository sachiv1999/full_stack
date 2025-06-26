const express= require('express');
const app= express();
const PORT= 8080;
const connectDb= require('../backend/Db/connectDb');
const cors= require('cors');
const morgan= require('morgan');
const router = require('./routes/index');

connectDb();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
app.use(router);

app.listen(PORT, ()=>{
    console.log(`server is connect ${PORT}`)
});


//npm init -y
//npm i express
//npm i nodemon express
//npm i mongoose
//npm i cors morgan
//npm i bcrypt jsonwebtoken