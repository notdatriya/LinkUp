const express=require('express');
const cors=require('cors');
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');

const app=express();
app.use(cors({
    origin:"*"
}))

app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/posts",postRouter);

app.listen(8080,()=>{
    console.log("server is listening on the port 8080");
})


