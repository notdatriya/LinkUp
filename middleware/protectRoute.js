const jwt  = require("jsonwebtoken");
const secret=require('../secret');

module.exports.protectRoute=function protectRoute(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ');
    if(token==null){
        res.json({
            error:'verification failed',
            success:0
        })
    }
    else{
        jwt.verify(token,secret,(err,user)=>{
            if(err){
                res.send({
                    success:0,
                    error:"verification failed"
                })
            }
            else{
                next()
            }
        })
    }
}