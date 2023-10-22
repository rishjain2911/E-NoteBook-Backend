const jwt=require("jsonwebtoken");
const JWT_SECRET="hellohowareyou";

const fetchuser=(req,res,next)=>{

    // login token which is provide when user logged in and match that token as auth-token inside header which returns an object

    const token=req.header('auth-token') // Token which is provide inside header with key auth-token and value current user token 
    if(!token){

        // if token not exist return error

        res.status(401).send({error: "Please authenticate using valid token"})
    }
    try {

        // Verify the token with the JWT_SECRET

        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user // data.user have a object that contains id which pass to the req.user
        // console.log(data);
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate using valid token"})
    }
}

module.exports=fetchuser