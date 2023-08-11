const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: [true, "이름을 설정해주세요"],
    unique: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
