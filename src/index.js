const express = require("express");
const http = require("http");
const path = require("path");
const chalk = require("chalk");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

io.on("connection", socket => {
  console.log("New Websocket connection");

  //Emit everybody except current client
  socket.broadcast.emit("message", "A new user has joined!");
  socket.on("sendMessage", (clientMessage, callback) => {
    const filter = new Filter();

    if (filter.isProfane(clientMessage)) {
      return callback("Profanity is not allowed");
    }
    io.emit("message", clientMessage); //send message to all connected clients
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const message = `https://google.com/maps?q=${coords.latitude},${
      coords.longitude
    }`;
    io.emit("message", message);
    callback()
  });
  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(PORT, () => {
  console.log(chalk.blue("Server is up on PORT " + PORT));
});
