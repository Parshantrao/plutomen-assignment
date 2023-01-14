const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const moment =require('moment')

const taskSchema = new mongoose.Schema({
    // name, status[Todo, InProgress, Completed ] , Create Date , Assigned to user]
    name:{type:String,required:true,lowercase:true,trim:true},
    status:{type:String,enum:["Todo","InProgress","Completed"],default:"Todo"},
    createDate:{type:Date,default: moment().format("YYYY-MM-DD")},
    user:{type:objectId,required:true,ref:"User"}
})

module.exports=mongoose.model("Task",taskSchema)