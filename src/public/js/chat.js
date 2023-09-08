const socket = io();

let user;

while (!user) {
  user = prompt("Ingresa tu nombre");
}

let chatBox = document.getElementById("chatBox");

socket.emit("authenticated", {user})

socket.on("newUserConnected", (user) => {
  if (!user) return;
  let liveUsers = document.getElementById("connectedUsers");
  let connectedUsers = "";
  connectedUsers = connectedUsers + `${user} </br>`;
  liveUsers.innerHTML = connectedUsers;
});

socket.on("messageLogs", (data) => {
  if (!user) return;
  let log = document.getElementById("messageLogs");
  let messages = '';
  data.forEach((message) => {
    console.log(message.message);
    messages = messages + `${message.user} dice: ${message.message} </br>`;
  });
  log.innerHTML = messages;
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      console.log(chatBox.value);
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});
