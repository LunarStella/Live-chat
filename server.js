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

  socket.on("newNamespace", (nameSpaceName) => {
    const nameSpace = io.of(`/${nameSpaceName}`);
    // 클라이언트 소켓을 새로운 네임스페이스로 연결
    nameSpace.on("connection", (socket) => {
      // 클라이언트와 네임스페이스 간의 작업 수행
      console.log(`Client connected to namespace: ${namespacePath}`);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("error", (error) => {
    console.error(error);
  });
});

//server1 채팅방
const chatChannel = io.of("/chatServer");

chatChannel.on("connection", (socket) => {
  // 사용자가 입장한 방에 room join
  socket.on("joinRoom", (roomName) => {
    console.log(roomName);

    socket.join(roomName); // 클라이언트를 해당 방에 가입시킴
  });

  // 클라이언트에서 message오면 다시 보내줌
  socket.on("sendChatMessage", (roomName, message) => {
    console.log(roomName);
    console.log("server sent: ", message);

    // 특정 room client에게만 message 보냄
    chatChannel
      .to(roomName)
      .emit("newChatMessage", { socketId: socket.id, message: message });
  });

  // 유저 나갈 시 알림
  socket.on("disconnectedUser", (socketId) => {
    console.log(socketId);
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
