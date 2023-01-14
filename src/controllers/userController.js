const {userModel,taskModel}=require('../models')
const validator=require('../utils/validators')
const moment = require('moment')

const userRegistration= async function(req,res){
    try{
        let data=req.body

        if(!validator.isValidObject(data)){
            return res.status(400).send({status:false, message:"pls provide user details for registration"})
        }

        let {name,email,role,department}=data

        let mandField = ["name","email","role","department"]
        for(let key of mandField){
            if(!validator.isValid(data[key])){
                return res.status(400).send({stauts:false ,message:`${key} field must be present`})
            }
        }

        // validations
        if(!validator.isValidName(name)){
            return res.status(400).send({status:false, message:"Invalid name(name must contains alphabets only)"})
        }
        if(!validator.isValidEmail(email)){
            return res.status(400).send({stuats:false,message:"Invlaid email"})
        }
        if(!validator.isValidString(role)){
            return res.status(400).send({stauts:false,message:"role can only contains numbers, alphabets and - , _ , ."})
        }
        if(!validator.isValidString(department)){
            return res.status(400).send({stauts:false,message:"department can only contains numbers, alphabets and - , _ , ."})
        }
        //

        // check for uniqueness of name and email
        const existedUser = await userModel.find({$or : [ {name} , {email} ] })    /// Object ShortHand property
        for(let key of existedUser){
            if(key.name==name.trim().toLowerCase()){
                res.status(400).send({status:false,msg:`${name} number is already taken`})
                return 
            }
            if(key.email==email.trim().toLowerCase()){
                res.status(400).send({status:false,msg:`${email} email is already taken`})
                return
            }
        }


        const user = await userModel.create(data)
        return res.status(201).send({stuats:true, message:"registration successfull", data:user})

    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const createTask = async function(req,res){
    try{
        let data = req.body
        const userId = req.params.userId

        if(!validator.isValidObject(data)){
            return res.status(400).send({stuats:false , message:"pls provide task details"})
        }
        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({stuats:false, message:"invalid userID"})
        }

        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({stuats:false ,message:"no such user found"})
        }

        let {name,status,createDate}=data

        
        if(!validator.isValid(name)){
            return res.status(400).send({status:false, message:`${key} value must be present`})
        }

        for(let key in data){
            if(!validator.isValid(data[key])){
                return res.status(400).send({status:false, message:`${key} can not be empty`})
            }
        }
        // validations
        if(!validator.isValidName(name)){
            return res.status(400).send({status:false, message:"Invalid name(name must contains alphabets only)"})
        }
        let taskStatus=["Todo","InProgress","Completed"]
        
        if(status){
            if(!validator.isValidStatus(status)){
                return res.status(400).send({status:false, message:`status can only be - ${taskStatus.join(",")}`})
            }
            // else if(validator.isValidStatus(status)){
                status=validator.isValidStatus(status)
            // }
        }
        
        if(createDate){
            if (!moment(createDate, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).send({ status: false, msg: "createDate should be in YYYY-MM-DD format" })
            }
            let date = moment().format("YYYY-MM-DD")
            if (moment(createDate).isBefore(date)) {
                return res.status(400).send({ status: false, msg: "pls provide an valid date (an upcoming date)" })
            }
        }
        
        if(await taskModel.findOne({user:userId,name})){
            return res.status(400).send({status:false ,message:"user already assign with this task"})
        }


        data={name,status,createDate,user:userId}

        let task = await taskModel.create(data)
        return res.status(201).send({status:true, message:"task assigned successfully", data:task})

    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const getTasksList = async function(req,res){
    try{
        
        let tasksList = await taskModel.find().populate("user").select({_id:0,name:1,status:1,createDate:1,user:1}).sort({createDate:1})
        return res.status(200).send({status:true, data:tasksList})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const getTaskByQuery = async function(req,res){
    try{
        let queryParams = req.query 
        if(!validator.isValidObject(queryParams)){
            return res.status(400).send({stuats:false, message:"pls provide filters(query params)"})
        }

        let params=["status","assignedUser"]
        for(let key in queryParams){
            if(!params.includes(key)){
                return res.status(400).send({status:false ,message:`queryParams can only be - ${params.join(",")}`})
            }
            if(!validator.isValid(queryParams[key])){
                return res.status(400).send({status:false ,message:`${key} can not be empty`})
            }
        }
        let obj={}
        if(queryParams.status){
            let taskStatus=["Todo","InProgress","Completed"]
            if(!validator.isValidStatus(queryParams.status)){
                return res.status(400).send({status:false, message:`status can only be - ${taskStatus.join(",")}`})
            }
            obj.status=validator.isValidStatus(queryParams.status)
        }
        // check if assignedUser is a objectId or a name
        if(queryParams.assignedUser){
            if(validator.isValidObjectId(queryParams.assignedUser)){
                obj.user=queryParams.assignedUser
            }
            else if(validator.isValidName(queryParams.assignedUser)){
                let user = await userModel.findOne({name:{$regex:queryParams.assignedUser.trim(),$options:"i"}}) 
                if(!user){
                    return res.status(400).send({status:false, message:"no such user found"})
                }
                obj.user=user._id.toString()
                console.log(obj,"obj")
            }
        }
        let task = await taskModel.find(obj).populate("user").select({_id:0,name:1,status:1,createDate:1,user:1})
        return res.status(200).send({status:true, data:task})
    }   
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

const getTaskByName = async function(req,res){
    try{
        let taskName = req.params.taskName
        // console.log(req.params,taskName)/
        if(!validator.isValidName(taskName)){
            return res.status(400).send({status:false, message:"taskName must contains only aplhabets"})
        }

        let task=await taskModel.find({name:{$regex:taskName.trim(),$options:"i"}}).populate("user")
        return res.status(200).send({status:true,data:task})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}


module.exports={
    userRegistration,
    createTask,
    getTasksList,
    getTaskByQuery,
    getTaskByName
}