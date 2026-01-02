import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/db.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "BEVHJBbkud"
const wss = new WebSocketServer({ port: 8080 });

const users=[];

function checkUser(token){
    try{
        const decode = jwt.verify(token,JWT_SECRET);

        if(!decode || !decode.userId){
            return null;
        }

        return decode.userId;
    }
    catch(err){
        return null;
    }
}

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});