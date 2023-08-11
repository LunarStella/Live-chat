const app = require("./app");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNHADLER REJECTIOIN! Shutting down");
  console.log(err.name, err.message);
  //나중에 다시 켜지게 만들기
  server.close(() => {
    process.exit(1);
  });
});

//main 채팅창
io.on("connection", async (socket) => {
  console.log("user conncected", socket.id);

  socket.on("request_message", (msg) => {
    io.emit("response_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("error", (error) => {
    console.error(error);
  });
});

//server1 채팅방
const home = io.of("/server1");

home.on("connection", (socket) => {
  socket.emit("usercount", io.engine.clientsCount);
  console.log(io.engine.clientsCount);

  socket.on("joinRoom", (roomName) => {
    console.log(roomName);

    socket.join(roomName); // 클라이언트를 해당 방에 가입시킴
  });

  socket.on("sendMessage", (roomName, message) => {
    console.log(roomName);
    console.log("server sent: ", message);

    home.to(roomName).emit("newMessage", message);
  });

  socket.on("disconnectRoom", (roomName) => {
    console.log("leave");
    socket.leave(roomName);
  });
  socket.on("disconnect", () => {
    console.log("room namespace 접속 해제");
  });
});

// DATABASE
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 8000;

const server = http.listen(port, () => {
  console.log(`Example app listening on port 8000`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHADLER REJECTIOIN! Shutting down");
  console.log(err.name, err.message);
  //나중에 다시 켜지게 만들기
  server.close(() => {
    process.exit(1);
  });
});
