
const express = require("express");
const User = require("../models/User");
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator"); //use this to conduct basic checks on the input
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

//u have to use a router inorder to use multiple routes on ur page

//------ ROUTE-1------(Create User)

//Create a User using : POST "localhost:3333/api/auth/createuser".
//the array item u see in line 9 is for checks which was taken from express validator
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // the next three lines are for error catching based on the array u see linee 20
    let success = false;
    const errors = validationResult(req);
    //console.log(req.body.name,req.body.email,req.body.password);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:success, errors: errors.array() });
    }
    try {
      // this down here is done to check whether an user aldrady exists with the same email
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ success:success, errors: "Sorry a user with this email aldready exists" });
      }

      //using bcryptjs i can hash the pass word the salt is nothing but additional characters added to the end of the password and then they are hashed together to create a much secure password
      const salt = await bcrypt.genSalt(10);
      const secPassy = await bcrypt.hash(req.body.password, salt);
      //creating a new user based on the schema/model and then sending to the database is done using create method
      success = true;
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassy,
      });

      const data = {
        user: {
          id: user.id,
          name : user.name
        },
      };

      //signing the jwt key using the JWT SECRET KEY and the data which is ntg but the id

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success:success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);

//------ ROUTE-2------(login)

//Creating Login route for users to login and rejecting them if they have inputed wrong credentials but using jwt token
//login : POST "localhost:3333/api/auth/login".
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").notEmpty(),
  ],
  async (req, res) => {
    // the next three lines are for error catching based on the array u see linee 9
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success : success,errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success : success, error: "Please Enter Correct Credentials" });
      }

      const pwd = await bcrypt.compare(password, user.password);

      if (!pwd) {
        return res
          .status(400)
          .json({ success : success, error: "Please Enter Correct Credentials" });
      }
      //console.log(user.name)
      const data = {
        user: {
          id: user.id,
          name : user.name
        },
      };

      success = true

      //signing the jwt key using the JWT SECRET KEY and the data which is ntg but the id

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success : success, authToken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Error");
    }
  }
);

//------ ROUTE-3------(getuser)
//Getting logged in user details
//Getting user details : POST "localhost:3333/api/auth/getuser".

router.post("/getuser",fetchuser,async (req, res) => {
  try {
    const userID = req.user.id;

    let user = await User.findById(userID).select("-password")

    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error");
  }
});

module.exports = router;
