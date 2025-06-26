const mongoose = require('mongoose');

function connectDb(){
    mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(()=>{
        console.log("Db is conncet");
    })
    .catch(()=>{
        console.log("Db is not connect")
    })
}

module.exports = connectDb