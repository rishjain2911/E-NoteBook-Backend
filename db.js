const mongoose=require("mongoose");
require("dotenv").config();
const mongoURI= process.env.mongoURI

const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected To Mongo");
    }).catch((err)=>{
        console.log(err.message);
        // process.exit(1);
    })
}

module.exports=connectToMongo;