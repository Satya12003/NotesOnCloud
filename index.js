const dotenv = require("dotenv");
dotenv.config();
const connectToMongo = require("./db");
var cors = require("cors");

const express = require("express");

//connection to mongo db in db.js
connectToMongo();

//dont worry about rest of the code expect routes which u have to write them on ur own but the rest of them u can get them from the express website
const app = express();
const port = process.env.PORT || 3333;

//this is a middleware which is used to parse the input and output in terms of json it is quite important
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
//Available routes ==> go to routes folder for more info
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
