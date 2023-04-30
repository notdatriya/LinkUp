const express=require('express');
const connection = require('../db');
const bcrypt=require('bcrypt');
const jsonwebtoken=require('jsonwebtoken');
const secret=require('../secret');
const protectRoute=require('../middleware/protectRoute');

const authRouter=express.Router();

authRouter.post('/signup',async (req,res)=>{
    let {fullname,password,email,profile_pic}=req.body;
    password=await bcrypt.hash(password,10);
    connection.query("insert into users(fullname,email,password,profile_pic)values(?,?,?,?)",
    [fullname,email,password,profile_pic],(err,result)=>{
        if(err){
            res.json({
                error:err.message,
                success:0
            })
        }
        else if(result){
            res.json({
                email,
                fullname,
                profile_pic
            })
        }
    });
});


authRouter.post('/login',function(req,res){
    let {email,password}=req.body;
    connection.query("select * from users where email=?",[email],async(err,result)=>{
        if(err){
            res.json({
                error:err.message,
                success:0
            })
        }
        else{
            if(result.length>0){
                const ans=await bcrypt.compare(password,result[0].password);
                if(ans){
                    delete result[0].password;
                    const token=await jsonwebtoken.sign({...result[0]},secret,{expiresIn:'10h'})
                    res.json({...result[0],token})
                }
                else{
                    res.json({
                        error:"Incorrect password",
                        success:0
                    })
                }
            }
            else{
                res.json({
                    error:"user not found",
                    success:0
                })
            }
        }
    })
})

authRouter.post('/getUserFromtoken',protectRoute,(req,res)=>{
    let token=req.body.token;
    jwt.verify(token,secret,(err,user)=>{
        if(err){
            res.send({
                success:0,
                error:"verification failed"
            })
        }
        else{
            res.json(user)
        }
    })
});

module.exports=authRouter;