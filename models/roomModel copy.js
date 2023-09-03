const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  // 방의 종류 설정, 기본 방, 유저가 생성한 방
  class: {
    type: String,
  },
  roomName: {
    type: String,
    required: [true, "이름을 설정해주세요"],
    unique: true,
  },
  history: [
    {
      type: String,
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
