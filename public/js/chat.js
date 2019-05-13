const socket = io();

const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const btnSubmit = document.querySelector("#btnSubmit");
const btnSendLocation = document.querySelector("#btnSendLocation");

socket.on("message", mess => {
  console.log(mess);
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();
  btnSubmit.setAttribute("disabled", "disabled");
  const inputContent = e.target.elements.message.value;

  socket.emit("sendMessage", inputContent, error => {
    if (error) {
      return console.log(error);
    }

    setTimeout(() => {
      btnSubmit.removeAttribute("disabled");
      messageInput.value = "";
      console.log("Message delivered!");
    }, 2000);
  });
});

btnSendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  btnSendLocation.removeAttribute("disabled");
  navigator.geolocation.getCurrentPosition(function(position) {
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, error => {
      btnSendLocation.removeAttribute("disabled");
      if (error) {
        return alert(error);
      }
      console.log("Location shared");
    });
  });
});
