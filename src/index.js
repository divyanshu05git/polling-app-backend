import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma} from './db.js';
import dotenv from 'dotenv';
import { middleware } from './middleware.js';
import crypto from 'crypto';

dotenv.config();

const app=express();
app.use(express.json());

const JWT_SECRET=process.env.JWT_SECRET || 'uifuhu3fqocbhkb';

app.post('/signup',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    const hashedPassword=await bcrypt.hash(password,10);

    // db logic 
    try{
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        res.json({
            message:"signing up successful",
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error signing up user",
            error:err.message
        })
    }

})

app.post("/signin",async(req,res)=>{
    const {email,password} = req.body;

    //db logic to check user 
    try{
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                message:"Invalid password"
            })
        }

        const token=jwt.sign({
           userId:user.id
        },JWT_SECRET)

        res.json({
            token
        })
    }
    catch(err){
        res.status(500).json({
            messsage:"Error signing in user",
            error:err.message
        })
    }
    
    
    
})

app.post('/room',middleware,async(req,res)=>{
    const roomName=req.body.name;

    if(!roomName){
        return res.status(400).json({
            message:"Room name is required"
        })
    }

    //for now
    const roomLink=crypto.randomBytes(16).toString('hex');

    try{
        const room = await prisma.room.create({
            data:{
                roomName,
                roomLink,
                adminId:req.userId
            }
        })

        res.json({
            roomLink:room.roomLink
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error creating room",
            error:err.message
        })
    }

})


app.get('/room/:roomLink',middleware,async(req,res)=>{
    const {roomLink} = req.params;
    
    try{
        const room= await prisma.room.findUnique({
            where:{
                roomLink
            }
        })

        res.json({
            room
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error fetching room",
            error:err.message
        })
    }
})


app.listen(5050,()=>{
    console.log('server is running on port 5050');
})