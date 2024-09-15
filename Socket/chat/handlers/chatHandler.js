const { getRoomName } = require('../lib/func');

module.exports = (io, socket) => {
	socket.on('chat:text', async (roomId, from, content, callback) => {
		const message = await $DB.chatMessages.create({
			from,
			content,
			roomId,
			type: 'text'
		})
		const roomName = getRoomName(roomId);
		socket.to(roomName).emit("chat:message", message);
		callback(message)
	})
}