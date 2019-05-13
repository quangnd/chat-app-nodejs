const socket = io();

const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const btnSubmit = document.querySelector("#btnSubmit");
const btnSendLocation = document.querySelector("#btnSendLocation");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format("hh:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();
  btnSubmit.setAttribute("disabled", "disabled");
  const inputContent = e.target.elements.message.value;

  socket.emit("sendMessage", {inputContent}, error => {
    if (error) {
      btnSubmit.removeAttribute("disabled");
      return console.log(error);
    }

    //Simulate async task
    setTimeout(() => {
      btnSubmit.removeAttribute("disabled");
      messageInput.value = "";
      console.log("Message delivered!");
    }, 1000);
  });
});

btnSendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  btnSendLocation.setAttribute("disabled", "disabled");
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

socket.on("locationMessage", message => {
  const html = Mustache.render(locationTemplate, {
    url: message.url,
    username: message.username,
    createdAt: moment(message.createdAt).format("hh:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
