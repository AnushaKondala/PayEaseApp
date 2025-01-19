const express=require("express");
const {authMiddleware}=require("../middlewares/validJWT");
const { account } = require("../db");
const { default: mongoose } = require("mongoose");
const router=express.Router();
router.get("/balance",authMiddleware,async(req,res)=>{
    const accountInfo= await account.findOne({
        userId:req.userId
    });
    return res.status(200).json({
        balance:accountInfo.balance
    })
})
router.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount, to} = req.body;
    console.log(`amount ${amount}`);
    const fromAccount=await account.findOne({
        userId:req.userId
    }).session(session);
    console.log(`from ${fromAccount}`);
    if(fromAccount.balance>= amount){
        console.log("balance available")
        const toAccount=await account.findOne({
            userId:to
        }).session(session);
        if(toAccount){
            await account.updateOne({
                userId:req.userId
            },{
              $inc: {
                balance:-amount
              }
            }
            ).session(session);
            await account.updateOne({
                userId:to
            },{
                $inc:{
                    balance:amount
                }
            }).session(session);
            await session.commitTransaction();
            return res.status(200).json({
                msg:"Transfer successful",
            })
        }
        else{
            await session.abortTransaction();
            return res.status(400).json({
                msg:"Invalid account"
            })
        }
    }
    else{
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Insufficient balance"
        })
    }
})
module.exports=router;