const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const mongoose=require("mongoose");
const Message=require("./models/Message");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("./models/User");
const auth=require("./middleware/auth")

const app=express();
const server=http.createServer(app);
const io=new Server(server);
require("dotenv").config();
mongoose.connect("process.env.MONGO_URI")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((err)=>{
    console.log(err);
});

let onlineUsers=0;
const users={};

app.use(express.static("public"));
app.use(express.json());

io.on("connection",(socket)=>{
    console.log("User Connected");
    onlineUsers++;
    io.emit("userCount",onlineUsers);
    socket.on("join",(username)=>{
        socket.username=username;
        if(!users[username]){
            users[username]=0;
        }
        users[username]++;
        io.emit("members",Object.keys(users));
        io.emit("systemMessage",`${username} joined the chat`);
    });

    socket.on("sendMessage",async(msg)=>{
        try{
            const savedMessage=await Message.create(msg);
            io.emit("receiveMessage",savedMessage);
        }
        catch(err){
            console.log(err);
        }
    });

    socket.on("disconnect",()=>{
        onlineUsers=Math.max(0,onlineUsers-1);
        if(socket.username){
            users[socket.username]--;
            if(users[socket.username]===0){
                delete users[socket.username];
                io.emit("systemMessage",`${socket.username} left the chat`);
            }
        }
        io.emit("members",Object.keys(users));
        io.emit("userCount",onlineUsers);
       
    });

    socket.on("typing",(username)=>{
        socket.broadcast.emit("showTyping",username);
    });

    socket.on("stopTyping",()=>{
        socket.broadcast.emit("hideTyping");
    });
    
    socket.on("messageSeen",async(data)=>{
        try{
            const message=await Message.findByIdAndUpdate(
            data.messageId,
            {
                $addToSet:{
                    seenBy:data.username
                }
            },
            {returnDocument:"after"}
        );
            io.emit("seenUpdated",{
            messageId:message._id,
            seenBy:message.seenBy
            });
        }
        catch(err){
            console.log(err);
        }

    });
});

// app.get("/messages",auth,async(req,res)=>{
//     try{
//         const messages=await Message.find().sort({createdAt:1});
//         res.json(messages);
//     }
//     catch(err){
//         res.status(500).json({error:"Failed to fetch messages"});
//     }
// });

app.post("/register",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const existingUser=await User.findOne({username});
        if(existingUser){
           return res.status(400).json({
                message:"User already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            username,
            password:hashedPassword
        });
        res.status(201).json({
            message:"User registered successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server error"
        });
    }

})

app.post("/login",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({
                message:"Invalid username or password"
            });

        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid username or password"
            });
        }
        const token=jwt.sign(
            {
                userId:user._id,
                username:user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
        res.json({
            message:"Login successful",
            token
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server error"
        })
    }
})


server.listen(3000,()=>{
    console.log("Server running on port 3000");
});