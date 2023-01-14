const nameRegex=/^[a-z ]+$/i
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const alphaNumRegex = /^[\w-_,. ]*$/
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

const isValidString = function(data){
    return alphaNumRegex.test(data)
}
const isValidObject = function(data){
    return Object.keys(data).length>0
}
const isValid = function(data){
    if(typeof data === undefined || data==null) return false;
    if(typeof data ==="string" && data.trim().length==0) return false
    return true
}
const isValidName = function(data){
    return nameRegex.test(data)
}
const isValidEmail = function(data){
    return emailRegex.test(data)
}

const isValidStatus =function(data){
    data = data.trim().toLowerCase()
    let task=["Todo","InProgress","Completed"]
    for(let key of task){
        let status = key.toLocaleLowerCase()
        if(data==status) return key
    }
    return false
}
const isValidObjectId = function(data){
    if(ObjectId.isValid(data)){
        if((String)(new ObjectId(data)) === data)
            return true;
        return false;
    }
    return false;
}

module.exports={
    isValid,
    isValidName,
    isValidEmail,
    isValidObject,
    isValidObjectId,
    isValidStatus,
    isValidString
}


