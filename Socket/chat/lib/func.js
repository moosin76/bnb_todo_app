const getRoomIds = async (userId) => {
	const data = await $DB.chatUsers.findAll({
		attributes: ['roomId'],
		where: { userId }
	})
	const rooms = data.map(room => room.roomId)
	return rooms;
}

const getRoomName = (roomId) => `room-${roomId}`;

const joinChatRoom = async (socket, roomId) => {
	const roomName = getRoomName(roomId);
	socket.join(roomName);

	const [room, users] = await Promise.all([
		$DB.rooms.findByPk(roomId, { attributes: ['id', 'name', 'category', 'userId', 'desc'] }),
		$DB.roomUserView.findAll({ where: { roomId: roomId } }),
		// $DB.chatMessages.findAndCountAll({ where: { roomId: roomId }, offset:0, limit:10, order:[['createdAt', 'DESC']] })
	])

	const result = room.toJSON();
	result.users = users.map(user => user.toJSON())
	// result.messages = messages.rows.map(message => message.toJSON());
	// result.messagesCount = messages.count;
	result.messages = [];
	result.messagesCount = 0;
	// console.log(result);

	return result;
}

module.exports = {
	getRoomIds,
	joinChatRoom,
	getRoomName
}