const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get('/', (req, res, next) => {
  res.send('Hello world')
})

const rooms = {
  1: {
    id: 1,
    host: 123,
    users: []
  }
} 

io.on("connection", (socket) => {
  socket.on('join', (data) => {
    const { roomId } = data;
    if(rooms.id) {
      
    } else {
      const newRoom = {
        id: roomId,
        host: '',
        users: []
      }
      rooms[roomId] = newRoom;
      socket.join(roomId);
    }
  });

  socket.on('newQuestion', data => {
    const { roomId, ...rest } = data;
    socket.to(roomId).emit('newQuestion', rest);
  })

  socket.on('newAnswer', data => {
    const { roomId, ...rest } = data;
    socket.to(roomId).emit('newAnswer', rest);
  }) 


});

httpServer.listen(4000);