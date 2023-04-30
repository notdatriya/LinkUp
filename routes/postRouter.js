const express=require('express');
const connection=require('../db');
const { protectRoute } = require('../middleware/protectRoute');
const { post } = require('./authRouter');
//const protectRoute=require('../middleware/protectRoute');

const postRouter=express.Router();

postRouter.get('/allPosts',protectRoute,(req,res)=>{
connection.query('select fullname,email,profile_pic,video_url from posts p cross join users u on p.user_id=u.id ',(err,result)=>{
    if(err){
        res.json({
            success:0,
            error:err.message
        })
    }
    else{
        if(result){
            res.json({
                result,
                success:1
            })
        }
        else{
            res.json({
                success:1,
                error:"No posts"
            })
        }
    }
    
})
})

postRouter.get('/:id',protectRoute,(req,res)=>{
    const id=req.params.id;
    connection.query('select fullname,email,profile_pic,video_url from posts inner join users on users.id=posts.user_id where post.id =?',[id],(err,result)=>{
        if(err){
            res.json({
                success:0,
                error:err.message
            })
        }
        else{
            if(result.length>0){
                res.json({
                result:result[0]
                })
            }
            else{
                res.json({
                    success:0,
                    error:"post not found or invalid post id"
                })
            }
        }
    })
})

postRouter.get('/myposts/:id',protectRoute,(req,res)=>{
    const id=req.params.id;
    connection.query('select fullname,email,profile_pic,video_url from posts inner join users on users.id=posts.user_id where users.id =?',[id],(err,result)=>{
        if(err){
            res.json({
                success:0,
                error:err.message
            })
        }
        else{
            if(result.length>0){
                res.json({
                result:result
                })
            }
            else{
                res.json({
                    success:0,
                    error:"post not found or invalid user id"
                })
            }
        }
    })
})

postRouter.post('/dolike/:id',protectRoute,(req,res)=>{
    const id=req.params.id;
    const authHeader=req.headers['authorization'];

    const token=authHeader && authHeader.split(' ')[1];

    jwt.verify(token,secret,(err,user)=>{
        if(err){
            res.send({
                success:0,
                error:"verification failed"
            })
        }
        else{
            connection.query('insert into likes(user_id,post_id)values(?,?)',[user.id,id],(err,result)=>{
                if(err){
                    res.json({
                        success:0,
                        error:err.message
                    })
                }
                else{
                    res.json({
                        success:1
                    })
                }
            })
        }
    })
})

//do not like
postRouter.delete("/dontlike/:id",protectRoute,(req,res)=>{
    const id=req.params.id;
    const authHeader=req.headers['authorization'];

    const token=authHeader && authHeader.split(' ')[1];

    jwt.verify(token,secret,(err,user)=>{
        if(err){
            res.send({
                success:0,
                error:"verification failed"
            })
        }
        else{
            connection.query('delete from likes where user_id=? and post_id=?',[user.id,id],(err,result)=>{
                if(err){
                    res.json({
                        success:0,
                        error:err.message
                    })
                }
                else{
                    res.json({
                        success:1
                    })
                }
            })
        }
    })
})

postRouter.get('/checklike/:id',protectRoute,(req,res)=>{
    const id=req.params.id;
    const authHeader=req.headers['authorization'];

    const token=authHeader && authHeader.split(' ')[1];

    jwt.verify(token,secret,(err,user)=>{
        if(err){
            res.send({
                success:0,
                error:"verification failed"
            })
        }
        else{
            connection.query('select * from likes where user_id=? and post_id=?',[user.id,id],(err,result)=>{
                if(err){
                    res.json({
                        success:0,
                        error:err.message
                    })
                }
                else{
                    if(result.length>0){
                        res.json({
                        success:1
                        })
                    }
                    else{
                        res.json({
                            success:0
                        })
                    }
                }
            })
        }
    })
})

//count likes
postRouter.get("/countlikes/:id",protectRoute,(req,res)=>{
    const id=req.params.id;
    connection.query('select count(*) as count from likes where post_id=?',[id],(err,result)=>{
        if(err){
            res.json({
                success:0,
                error:err.message
            })
        }
        else{
            if(result.length>0){
                res.json({
                    result:result[0]
                })
            }
        }
    })
})
module.exports=postRouter;