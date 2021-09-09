const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let rooms = [];

const initRooms = () => {
  for (let i = 0; i < 1000; i++) rooms[i] = { socketId: 0, messages: [] };
};
initRooms();

const createRoom = (socketId, roomNumber) => {
  rooms[roomNumber] = { socketId, messages: [] };
};

const addMessage = (room, message, userName) => {
  rooms[room].messages.push({ message, userName });
};

const removeRoom = (RemovedId) => {
  let roomNumber = rooms.find((r) => r.socketId === RemovedId);
  roomNumber.socketId = 0;
};

const createRoomNumber = () => {
  let roomNumber = 0;
  do {
    roomNumber = parseInt(Math.random() * 1000);
  } while (rooms[roomNumber].socketId !== 0);
  return roomNumber;
};

io.on("connection", (socket) => {
  const roomNumber = createRoomNumber();
  socket.emit("get-room-number", roomNumber);
  createRoom(socket.id, roomNumber);

  socket.broadcast.emit("get-rooms", rooms);
  socket.emit("get-rooms", rooms);

  socket.on("send-message", (payload) => {
    if (payload.message !== "") {
      io.to(payload.room).emit("get-message", payload);
      socket.broadcast.emit("notify-message", payload);
      addMessage(payload.room, payload.message, payload.userName);
    }
  });

  socket.on("join-room", async (room) => {
    await socket.join(room);
    socket.emit("get-room-messages", rooms[room].messages);
  });

  socket.on("leave-room", async (room) => {
    await socket.leave(room);
  });

  socket.on("disconnecting", () => {
    removeRoom(socket.id);
    socket.broadcast.emit("get-rooms", rooms);
    socket.broadcast.emit("left-room", roomNumber);
  });
});

server.listen(5050, function () {
  console.log("listening on port 5050");
});
