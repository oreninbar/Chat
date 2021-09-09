#Socket endpoints explanation

## ----Listening----

<hr/>

## send-message

listens to sending messsage event and gets payload. Sends the payload to the room and then norify all sockets that a message had been sent.
Support component will listen to "notify-message" and updates the online rooms list (will appears with chat icon)

socket.on("send-message", (payload) => {
if (payload.message !== "") {
io.to(payload.room).emit("get-message", payload);
socket.broadcast.emit("notify-message", payload);
addMessage(payload.room, payload.message, payload.userName);
}
});

---

## join-room

Gets room number and connects the socket to a room, and after joining, the server sends to the socket all the room messages

socket.on("join-room", async (room) => {
await socket.join(room);
socket.emit("get-room-messages", rooms[room].messages);
});

---

## leave-room

listening to support event. Gets room number leaves room when pressing on another room in the Support room list

socket.on("leave-room", async (room) => {
await socket.leave(room);
});

---

## disconnecting

On disconnecting , removes from the rooms list the room.
and broadcast to all the updated rooms list and the room that had left

socket.on("disconnecting", () => {
removeRoom(socket.id);
socket.broadcast.emit("get-rooms", rooms);
socket.broadcast.emit("left-room", roomNumber);

});

## ----Broadcasting----

<hr/>

## get-room-number

sends the socket room number after connection
socket.emit("get-room-number", roomNumber);

## get-rooms
Sends to all Sockets the rooms list after connection  

socket.broadcast.emit("get-rooms", rooms);
