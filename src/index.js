const express = require("express");
const http = require('http')
const path = require("path");
const chalk = require("chalk");
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
  console.log('New Websocket connection')

  socket.on('sendMessage', (message) => {
    io.emit('message', message) //send message to all connected clients
  })
})



server.listen(PORT, () => {
  console.log(chalk.blue("Server is up on PORT " + PORT));
});
