const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");


const io = new Server(server);

app.get("/", (req, res) => {
  res.send("ok");
});

let roomIdGlobal, imgURLGlobal

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("BoardDataResponse", {
      imgURL: imgURLGlobal,
    });
  });

  socket.on("BoardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("BoardDataResponse", {
      imgURL: data,
    });
  });

  socket.on("guess", (data) => {
    const { guess } = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(roomIdGlobal).emit("guessResponse", {
        ...user,
        guess,
      });
    }
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
