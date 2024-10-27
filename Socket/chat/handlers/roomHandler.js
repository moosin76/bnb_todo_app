const { joinChatRoom, getRoomName } = require('../lib/func');

module.exports = (io, socket) => {
	socket.on('room:addRoom', async (roomId, callback) => {
		console.log("room:addRoom", roomId);
		const room = await joinChatRoom(socket, roomId);
		const roomName = getRoomName(roomId);
		// room에 포함된 유저들에게 내가 접속했음을 알림
		const me = room.users.find(user => user.userId == socket.userId);
		socket.to(roomName).emit('room:joinUser', roomId, me)
		callback(room);
	})
	socket.on('room:leave', async (roomId, callback) => {
		console.log("room:leave", roomId, socket.userId);
		// DB에서 삭제
		const data = await $DB.chatUsers.destroy({
			where: { roomId, userId: socket.userId }
		})
		console.log("chatuser Destory", data);
		if (data == 1) {
			// 방탈퇴를 알림
			const roomName = getRoomName(roomId);
			socket.to(roomName).emit('room:leave', roomId, socket.userId);

			// 방에서 나가기
			socket.leave(roomName);
			callback(true);
		} else {
			callback(false);
		}


	})
}