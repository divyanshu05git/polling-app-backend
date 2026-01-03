import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/db.js';
import dotenv from 'dotenv';
import { parse } from 'path';
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

wss.on('connection', function connection(ws,request) {

  const url  = request.url;

  if(!url){
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token');
  const userId= checkUser(token);

  if(!userId){
    ws.close();
    return ;
  }

  users.push({
    userId,
    rooms:[],
    ws
  })

  ws.on('message', async function message(data){
    let parsedData;

    if(typeof data !== 'string'){
      parsedData = JSON.parse(data.toString());
    }
    else{
      parsedData = JSON.parse(data);
    }

    try{
      if(parsedData.type === 'join_room'){
        const user = users.find(u => u.ws===ws);
        user?.rooms.push(parsedData.roomId)
        console.log(userId+" joined room"+parsedData.roomId);
        console.log(users);
      }

      if(parsedData.type === 'leave_room'){
        const user = users.find(u => u.ws===ws);

        if(!user) return;

        user.rooms = user?.rooms.filter(x => x!==parsedData.room);
      }

      if(parsedData.type === 'poll'){
        const roomId= parsedData.roomId;
        const polls = parsedData.polls;

    

        await prisma.poll.create({
          data:{
            roomId: Number(roomId),
            polls: polls, 
            userId: userId
          }
        })

        users.forEach(u =>{
          if(u.rooms.includes(roomId)){
            u.ws.send(JSON.stringify({
              type: 'poll',
              polls: polls,
              roomId
            }))
          }
        })
      }
    }
    catch(err){

    }
  })

  
});