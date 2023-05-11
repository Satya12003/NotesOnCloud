const dotenv = require("dotenv");
dotenv.config();
const connectToMongo = require("./db");

const express = require("express");

//connection to mongo db in db.js
connectToMongo();

//dont worry about rest of the code expect routes which u have to write them on ur own but the rest of them u can get them from the express website
const app = express();
const port = process.env.PORT || 3333;

//this is a middleware which is used to parse the input and output in terms of json it is quite important
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Available routes ==> go to routes folder for more info
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
