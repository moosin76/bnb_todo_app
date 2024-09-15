const { joinChatRoom, getRoomName } = require('../lib/func');

module.exports = (io, socket) => {
	socket.on('room:addRoom', async (roomId, callback)=>{
		console.log("room:addRoom", roomId);
		const room = await joinChatRoom(socket, roomId);
		const roomName = getRoomName(roomId);
		// room에 포함된 유저들에게 내가 접속했음을 알림
		const me = room.users.find(user=> user.userId == socket.userId);
		socket.to(roomName).emit('room:joinUser', roomId, me)
		callback(room);
	})
}