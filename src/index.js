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
  // 1: {
  //   id: 1,
  //   host: 123,
  //   users: []
  // }
} 

io.on("connection", (socket) => {
  socket.on('join', (data) => {
    const { roomId, user, isHost } = data;
    socket.join(roomId);
    if(rooms[roomId]) {
      const usersList = rooms[roomId].users;
      if(!usersList.includes(user)) {
        usersList.push(user);
        rooms[roomId].users = usersList;
      }
    } else {
      const newRoom = {
        id: roomId,
        host: isHost ? user : '',
        users: [user]
      }
      rooms[roomId] = newRoom;
    }
    io.in(roomId).emit('participantsInRoom', rooms[roomId].users);
  });

  socket.on('newQuestion', data => {
    const { roomId, ...rest } = data;
    socket.to(roomId).emit('newQuestion', rest);
  })

  socket.on('newAnswer', data => {
    const { roomId, ...rest } = data;
    io.in(roomId).emit('newAnswer', rest);
  }) 


});

httpServer.listen(4000);