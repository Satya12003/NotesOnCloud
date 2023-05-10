//This is a Schema or model which is nothing but a structure for the data to be enterd into the database

const mongoose = require('mongoose')
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user :{
     type : mongoose.Schema.Types.ObjectId,
     ref : 'user'
  },
  name :{
    type : String,
 },
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true,
  },
  tag : {
    type : String,
    default : "General"
  },
  date : {
    type : Date,
    default : Date.now
  },
});

module.exports = mongoose.model('notes',NotesSchema);