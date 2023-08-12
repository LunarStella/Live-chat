const Room = require("../models/roomModel");
const catchAsync = require("../utils/catchAsync");
const path = require("path");
const url = require("url");
const AppError = require("../utils/appError");

// DB 모든 room 이름만 가져옴
exports.getAllRoomsName = catchAsync(async (req, res, next) => {
  // MongoDB에서 rooms 컬렉션의 roomName 필드만 조회하여 배열로 가져오기
  roomsData = await Room.find({}, { roomName: 1, _id: 0 });
  roomList = roomsData.map((room) => room.roomName);

  //req에 roomList 추가
  req.body.roomList = roomList;

  next();
});

exports.enterMainRoom = async (req, res, next) => {
  //roomList 개설된 채팅방 나타냄
  res.status(200).render("index", { roomList });
};

exports.enterSpecificRoom = (req, res, next) => {
  const roomId = req.params.id; // :id에 해당하는 값 가져오기

  // roomId를 이용하여 해당 방의 데이터를 가져오거나, 해당 방으로 접속 등의 처리를 수행합니다.
  res.render("chatroom", { roomName: roomId });
};

//mongodb 방 생성
exports.createRoom = catchAsync(async (req, res, next) => {
  const newRoom = await Room.create(req.body);

  res.redirect(`/chat/${newRoom.roomName}`);
});

exports.getAllRooms = catchAsync(async (req, res) => {
  // MongoDB에서 rooms 컬렉션의 roomName 필드만 조회하여 배열로 가져오기
  const roomsData = await Room.find({}, { roomName: 1, _id: 0 });
  const roomsArray = roomsData.map((room) => room.roomName);

  // 클라이언트에게 JSON 형태의 배열로 보내기
  res.send(JSON.stringify(roomsArray));
});

//해당 room이 DB에 존재하는지 확인
exports.protectRoom = catchAsync(async (req, res, next) => {
  const roomId = req.params.id;
  if (!(await Room.findOne({ roomName: roomId }))) {
    return next(new AppError(`There is no room for a ${roomId}`, 404));
  }

  next();
});

exports.changeRoomName = (req, res, next) => {};
