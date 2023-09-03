function joinRoom() {
  socket.emit("joinRoom", roomName);
}
