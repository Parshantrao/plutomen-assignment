const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/route')
const multer = require('multer')
const app=express()

app.use(multer().any())
app.use(express.json())

mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb+srv://Parshant_rao:C4fIOvHGi74DVINv@newcluster.squkrr6.mongodb.net/plutomen"
)
    .then(()=>console.log("MongoDb is connected"))
    .catch((err)=>console.log(err))

app.use(router)
app.listen(3000,()=>console.log("Server is running on 3000"))

