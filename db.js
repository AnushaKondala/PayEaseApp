const mongoose=require("mongoose");
require('dotenv').config();
const connectionString= process.env.url;
mongoose.connect(connectionString);
const userSchema=new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50

    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    password:{
        type:String,
        required:true,
        minLength:8
    }
});
const user=mongoose.model('User',userSchema);
const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
const account=mongoose.model('Account',accountSchema);
module.exports={
    user,
    account
}