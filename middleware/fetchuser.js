var jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchuser = (req, res, next) => {


  //Get the user form the jwt token and add id to req obj
  const token = req.header("auth-token");
  
  //console.log(token)
  try {
    if (!token) {
      res.status(401).send({ error: "Please authenticate using valid token" });
    }
    const data = jwt.verify(token, JWT_SECRET);

    req.user = data.user;

    //qualified for next middleware or step
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

module.exports = fetchuser;
