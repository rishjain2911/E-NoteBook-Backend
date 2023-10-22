const express=require("express")
const router=express.Router()
const User=require("../models/User")
const {body,validationResult} = require("express-validator")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")
require("dotenv").config();
const JWT_SECRET=process.env.JWT_SECRET
const fetchUser=require("../middleware/fetchUser")

// router.post("/auth",(req,res)=>{

//     const newUser=User(req.body);
//     newUser.save() //We can also save the data in database using .save() function by importing the schemas.
//     console.log(req.body);
//     res.json(req.body);
// })

// This route for creating a user
router.post("/createuser",[

    // check the name, email, password in json body and validate it as request.

    body('name','Enter a valid name').isLength({min: 3}),
    body("email","Enter a valid email").isEmail(),
    body("password","Enter a valid password").isLength({min: 8})
    ],async(req,res)=>{

    let success=false;

    const errors=validationResult(req); // check errors which occurs inside the body if errors return errors

    if(!errors.isEmpty()){
        return res.status(400).json({success,errors: errors.array()})
    }

    try {
        
        // Firstly Check the user which is already exist or not, if user is already exist return error

        let user=await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({success,error: 'Sorry a user with this email is already exist'});
        }

        // if user is not exist then create a user and generate a hashed password of user.

        const salt=await bcrypt.genSalt(10); // create a salt
        const secPassword=await bcrypt.hash(req.body.password,salt) // add salt with the user password

        user=await User.create({
            name:req.body.name,
            email:req.body.email,
            // password:req.body.password
            password:secPassword // create a hashed password by using hash bcrypt
        })

        // create an object data which contains user's id and validate/sign this object as jwt with jwt_secret this will return a token
        const data={
            user:{
                id: user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET)
        success=true;
        res.json({success,authToken})
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
})

// This route is for login a user

router.post("/login",[

    // write existing email and password in json body as a request

    body('email','Enter a valid Email'),
    body('password','Enter a valid Password')
],async(req,res)=>{
    
    let success=false;

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors: errors.array()})
    }

    // we take email and password in json body as a request

    const {email,password}=req.body
    try {

        // firstly check Email is exist or not if exist check the jsonbody-password with current email-password using bcrypt using compare function if not exist return error.

        const userEmail=await User.findOne({email})
        if(!userEmail){
            return res.status(404).json({success,msg: "Please Provide Valid Email"});
        }
        // console.log(userEmail);
        const validpass=await bcrypt.compare(password,userEmail.password);
        if(!validpass){
            return res.status(404).json({success,msg: "Please Provide Valid Password"});
        }

        // create an object data which contains user's id and validate/sign this object as jwt with jwt_secret this will return a token

        const data={
            user:{
                id: userEmail.id
            }
        }

        const authToken=jwt.sign(data,JWT_SECRET)
        success=true
        res.json({success,authToken})
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }

}) 

// This route is for fetch a user
router.post("/getuser",fetchUser,async(req,res)=>{
    try {

        // req.user contains object and in the object there is an id so we can assess to that id by using req.user.id

        let userId=req.user.id;  // return user id through this id we can find the user and return that user
        // console.log(userId);
        const user=await User.findById(userId).select("-password")  // In this .select("-password") means password is not show in the response
        res.send(user)

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
})

module.exports=router;