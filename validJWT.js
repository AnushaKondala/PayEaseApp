const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const jwtPassword=JWT_SECRET;
function authMiddleware(req,res,next){
    const authorization=req.headers.authorization;
    if(!authorization || !authorization.startsWith("Bearer")){
        res.status(403).json({});
    }
    const token=authorization.split(" ")[1];
    try{
        const decoded=jwt.verify(token,jwtPassword);
        console.log(decoded);
        if(decoded.userId){
            req.userId=decoded.userId;
            next();
        }
        else{
            res.status(403).json({});
        }
    }
    catch(err){
        res.status(403).json({
            msg:err
        })
    }
}
module.exports={
    authMiddleware
}