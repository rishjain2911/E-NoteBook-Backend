const express=require("express")
const router=express.Router()
const fetchUser=require("../middleware/fetchUser")
const Note=require("../models/Notes")
const { body, validationResult } = require("express-validator")

router.get("/fetchallnotes",fetchUser,async(req,res)=>{
    try {
        const notes=await Note.find({user: req.user.id}) // fetch all the notes have user id passed through the data.user to req.user in fetchUser middleware. 
        console.log(req.user.id);
        res.json(notes);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

router.post("/addnote",fetchUser,[
    body('title','Enter a title').isLength({min: 3}),
    body('description','Enter a description').isLength({min: 5})
],async(req,res)=>{
    const {title,description,tag}=req.body;
    try {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(401).json({errors: errors.array()})
        }
        // in note there have user: req.user.id for storing the id of the particular user that are logged in and in Note, the note contain that user id which have logged in.
        const note=new Note({
            title, description, tag, user: req.user.id
        })
        const savednote=await note.save()
        // console.log(req.user.id);
        res.json(savednote);

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

router.put("/updatenote/:id",fetchUser,async(req,res)=>{
    const {title,description,tag}=req.body;
    try {
        const newNote={}
        if(title){
            newNote.title=title
        }
        if(description){
            newNote.description=description
        }
        if(tag){
            newNote.tag=tag
        }
        let note=await Note.findById(req.params.id) // req.params.id means passed it within query
        if(!note){
            return res.status(404).send("Not Found")
        }
        // Check the note.user and the req.user are same if not same the user is different it means other user access other notes
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed")
        }
        note=await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new: true})
        // console.log(note.user.toString());
        // console.log(req.user.id);
        res.json(note)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

router.delete("/deletenote/:id",fetchUser,async(req,res)=>{
    try {
        let  note=await Note.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not Found")
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed")
        }
        // Delete the particular note having the id passed to the query.
        note=await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "note has been deleted",note: note});
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

module.exports=router;