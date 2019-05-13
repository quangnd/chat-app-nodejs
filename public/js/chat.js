const socket = io();

const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const btnSubmit = document.querySelector("#btnSubmit");
const btnSendLocation = document.querySelector("#btnSendLocation");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoScroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format("hh:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();
  btnSubmit.setAttribute("disabled", "disabled");
  const inputContent = e.target.elements.message.value;

  socket.emit("sendMessage", { inputContent }, error => {
    if (error) {
      btnSubmit.removeAttribute("disabled");
      return alert(error);
    }

    btnSubmit.removeAttribute("disabled");
    messageInput.value = "";
    console.log("Message delivered!");
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

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
    totalUser: users.length
  });
  document.querySelector("#sidebar").innerHTML = html;
});
