const express=require('express')
const router=express.Router()
const controller = require("../controllers/userController")
router.get("/test-me",function(req,res){
    res.send("running")
})

router.post("/user",controller.userRegistration)

router.post("/task/:userId",controller.createTask)

router.get("/tasks",controller.getTasksList)

router.get("/task",controller.getTaskByQuery)

router.get("/task/:taskName",controller.getTaskByName)

module.exports=router