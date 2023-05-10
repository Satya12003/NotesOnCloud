//This is a Schema or model which is nothing but a structure for the data to be enterd into the database

const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
  name : {
    type : String,
    required : true // means it is required feild we cannot leave it blank or leave it empty.
  },
  email : {
    type : String,
    required : true,
    unique: true //menas it should be unique multiple entries of the same email cannot be entered
  },
  password : {
    type : String,
    required : true,

  },
  date : {
    type : Date,
    default : Date.now
  },
});
const User = mongoose.model('user',UserSchema);

module.exports = User;