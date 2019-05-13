const express = require("express");
const http = require("http");
const path = require("path");
const chalk = require("chalk");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

io.on("connection", socket => {
  console.log("New Websocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error || !user) {
      callback(error);
    }

    socket.join(room);

    socket.emit("message", generateMessage(`Welcome to ${room} room`));
    //Emit everybody except current client
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${user.username} has joined!`));

    callback();
  });

  socket.on("sendMessage", (clientMessage, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter();

    if (filter.isProfane(clientMessage.inputContent)) {
      return callback("Profanity is not allowed");
    }
    io.to(user.room).emit("message", generateMessage(clientMessage.inputContent, user.username)); //send message to all connected clients
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id)
    const message = `https://google.com/maps?q=${coords.latitude},${
      coords.longitude
    }`;

    io.to(user.room).emit("locationMessage", generateLocationMessage(message, user.username));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left!`, 'Admin')
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(chalk.blue("Server is up on PORT " + PORT));
});
