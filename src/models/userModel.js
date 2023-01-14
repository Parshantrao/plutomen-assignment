const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,lowercase:true,trim:true,unique:true},
    email:{type:String,required:true,lowercase:true,trim:true,unique:true},
    role:{type:String,required:true,lowercase:true,trim:true},
    department:{type:String,required:true,lowercase:true,trim:true},
})

module.exports = mongoose.model("User",userSchema)