const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator"); //use this to conduct basic checks on the input

//------ ROUTE-1------(fetching all notes)

//fetching all notes using : POST "localhost:3333/api/notes/fetchallnotes".

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Internal Error");
  }
});

//------ ROUTE-2------(Adding a note)

//Adding a note using : POST "localhost:3333/api/notes/addnote".

router.post(
  "/addnote",
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  fetchuser,
  async (req, res) => {
    // the next three lines are for error catching based on the array u see linee 9
    // const hello = req.user.id;
    // console.log(hello);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      
    
    try {
        const { title, description, tag } = req.body;
      const note = new Notes({
        title,description,tag,user : req.user.id,name : req.user.name
      })
      const savedNote = await note.save();
       res.json(savedNote)
    } catch (error) {
      res.status(500).send("Internal Error");
    }
  }
);

router.put(
  "/updatenote/:id",fetchuser,
  async (req, res) => {
    
    try {
        const { title, description, tag } = req.body;

      const newnote = {}
      if(title) {newnote.title = title}
      if(description) {newnote.description = description}
      if(tag) {newnote.tag = tag}

      let note = await Notes.findById(req.params.id);

      if(!note)
      {
        return res.status(404).send("Not Found");
      }
      if(note.user.toString() !== req.user.id )
      {
        return res.status(401).send("Not Authorized");
      }

      note = await Notes.findByIdAndUpdate(req.params.id , {$set: newnote} , {new:true})
      res.json({note});
    } catch (error) {
      res.status(500).send("Internal Error");
    }
  }
);



router.delete(
  "/deletenote/:id",fetchuser,
  async (req, res) => {
    
    try {

      let note = await Notes.findById(req.params.id);

      if(!note)
      {
        return res.status(404).send("Not Found");
      }
      if(note.user.toString() !== req.user.id )
      {
        return res.status(401).send("Not Authorized");
      }

      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({"Success" : "Note has been deleted" , note : note});
    } catch (error) {
      res.status(500).send("Internal Error");
    }
  }
);


module.exports = router;
