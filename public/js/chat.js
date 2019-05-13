const socket = io();

socket.on("message", mess => {
  console.log(mess);
});

document.querySelector("#message-form").addEventListener("submit", e => {
  e.preventDefault();

  const inputContent = e.target.elements.message.value;

  socket.emit("sendMessage", inputContent, error => {
    if (error) {
      return console.log(error)
    }
    console.log("Message delivered!");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, error => {
      if (error) {
        return alert(error)
      }
      console.log('Location shared')
    });
  });
});
