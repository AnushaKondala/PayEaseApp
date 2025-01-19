
const express=require('express');
const router=express.Router();
const {account, user}= require("../db");
const {credentials, updateBody, userInfo }=require("../validation");
const {JWT_SECRET}=require("../config");
const {authMiddleware}=require("../middlewares/validJWT");
const jwt=require("jsonwebtoken");
const jwtPassword=JWT_SECRET;
let token=""
router.post("/signUp",async(req,res)=>{
    const userDetails=req.body;
    console.log(userDetails);
    const response=userInfo.safeParse(userDetails);
    console.log(response);
    if(response.success){
        const userExists=await user.findOne({
            username:userDetails.username
        })
        if(!userExists){

            const createdUser=await user.create({
                username:userDetails.username,
                firstName:userDetails.firstName,
                lastName:userDetails.lastName,
                password:userDetails.password
            });
            const userId=createdUser._id;
            //creating account for the user
            await account.create({
                userId,
                balance:Math.random()*10000+1
            })
            token=jwt.sign({userId},jwtPassword);
            return res.status(200).json({
                msg:"user created successfully",
                token
            })
        }
        else{
            return res.status(411).json({
                msg:"email already taken/incorrect inputs"
            })
        }
    }
    else{
        return res.status(411).json({
            msg:"email already taken/incorrect inputs"
        })
    }
  
})
router.post("/signIn", async(req,res)=>{
    const userCredentials=req.body;
    const response=credentials.safeParse(userCredentials);
    if(response){
        const checking=await user.findOne({
            username:userCredentials.username,
            password:userCredentials.password
        })
        if(checking){
            const userId=checking._id;
            token=jwt.sign({userId},jwtPassword);
            return res.json({
                token
            })
        }
        else{
            res.status(411).json({
                mesage:"Error while logging in"
            })
        }
    }
})

router.put("/",authMiddleware,async(req,res)=>{
    const updatedCredentials=req.body;
    const checking=updateBody.safeParse(updatedCredentials);
    if(checking.success){
        await user.updateOne(
            { _id : updatedCredentials.id },
            {
                firstName:updatedCredentials.firstName,
                lastName:updatedCredentials.lastName,
                password:updatedCredentials.password
            }
        )
        res.status(200).json({
                msg:"Updated successfully"
        })
        
    }
    else{
        res.status(411).json({
            msg:"Error while updating information"
        })
    }
})
router.get("/bulk",authMiddleware,async(req,res)=>{
    // to query : select * from user where firstname like  %anu% or lastname like %anu%
    console.log("hello")
    const filter=req.query.filter || "";
    const fetchedUser=await user.find({
        $or:[
            {'firstName':{
                    "$regex":filter
                }
            },
            {'lastName':{
               "$regex":filter
             }
            }
        ]
    })
    if(fetchedUser){
        return res.status(200).json({
            users: fetchedUser.filter((user)=>(
               user._id !=req.userId

            ))
           
        })
    }

})

module.exports=router;