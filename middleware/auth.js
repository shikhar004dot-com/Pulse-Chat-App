const jwt=require("jsonwebtoken");
const auth=(req,res,next)=>{
    const token=req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message:"Access denied"
        })
    }
    try{
        const verified=jwt.verify(token,"pulse_secret_key");
        req.user=verified;
        next();
    }
    catch(err){
        res.status(401).json({
            message:"Invalid token"
        });
    }
}
module.exports=auth;