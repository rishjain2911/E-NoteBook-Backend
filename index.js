const express=require("express")
var cors = require('cors')
const app=express()
const mongoDB=require("./db")
require("dotenv").config(); 
const port=process.env.PORT || 5000
mongoDB();

app.use(cors())
app.use(express.json())

// app.get("/",(req,res)=>{
//     res.status(200).json({msg: 'Hello'})
// })

app.use("/api",require("./routes/notes"))
app.use("/api",require("./routes/auth"))

app.listen(port,()=>{
    console.log(`Server Running at ${port}`);
})