const socket = io();

socket.on("message", mess => {
  console.log(mess);
});

document.querySelector("#message-form").addEventListener("submit", e => {
  e.preventDefault();

  const inputContent = e.target.elements.message.value;

  socket.emit("sendMessage", inputContent);
});
