// import mongoose from 'mongoose';
const mongoose=require("mongoose")
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    unique: true,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports=mongoose.model("users",UserSchema);