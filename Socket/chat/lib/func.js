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
	socket.join(getRoomName(roomId));

	const [room, users, messages] = await Promise.all([
		$DB.rooms.findByPk(roomId, { attributes: ['id', 'name', 'category', 'userId', 'desc'] }),
		$DB.roomUserView.findAll({ where: { roomId: roomId } }),
		$DB.chatMessages.findAll({ where: { roomId: roomId } })
	])

	const result = room.toJSON();
	result.users = users.map(user => user.toJSON())
	result.messages = messages.map(message => message.toJSON())
	console.log(result);

	return result;
}

module.exports = {
	getRoomIds,
	joinChatRoom, 
	getRoomName
}