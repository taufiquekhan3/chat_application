import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import path from "path";

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

const httpserver = createServer(app);//creating a http server;
const io = new Server(httpserver);//passing in httpserver her

app.use(express.static("public"));

 var chat=[];
const connectedusers = new Set();
var users = {}

io.on("connection",(socket) => {  
  socket.on('login',(username) => {
    users[socket.id] = username;
    socket.broadcast.emit('login done',username +':joined the chat')

  })
    //getting data from client and storing in chat history
    socket.on("send", data => {
        console.log(data)
       socket.broadcast.emit('receive',{message:data , name:users[socket.id]}) 
    })

    socket.on('message left',() => {
        socket.emit('incoming',chat);
    })
   
   socket.on('send-chat-with-name',data => {

   })
    
   
    socket.on('disconnect',() => {
        console.log('a user disconnected ')
        connectedusers.delete(socket.id)
    })
})


app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    
})

httpserver.listen(process.env.Port || 3000,() => {
   console.log("server is up and running");
})