const connectToMongo = require('./db')
var cors = require('cors')

const express = require('express')


//connection to mongo db in db.js
connectToMongo();

//dont worry about rest of the code expect routes which u have to write them on ur own but the rest of them u can get them from the express website
const app = express()
const port = 3333

//this is a middleware which is used to parse the input and output in terms of json it is quite important
app.use(cors())
app.use(express.json())


//Available routes ==> go to routes folder for more info
app.use('/api/auth',require("./routes/auth"))
app.use('/api/notes',require("./routes/notes"))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})