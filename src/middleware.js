import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET || "guyf3bhjih";

export function middleware(req,res,next){
    const token= req.headers['authorization'] ?? "";

    try{
        const decoded=jwt.verify(token,JWT_SECRET);

        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }

        req.userId=decoded.userId
        next();

    }
    catch(err){
        return res.status(401).json({
            message:"Unauthorized",
            error:err.message
        })
    }
}