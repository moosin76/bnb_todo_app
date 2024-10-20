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

	socket.on('chat:file', async (roomId, from, fileInfo, callback) => {

		// console.log(roomId, from, fileInfo);
		// callback({ roomId, from, fileInfo })

		const message = await $DB.chatMessages.create({
			from,
			content: JSON.stringify(fileInfo),
			roomId,
			type: fileInfo.type.startsWith('image') ? 'image' : 'file'
		})
		const roomName = getRoomName(roomId);
		socket.to(roomName).emit("chat:message", message);
		// console.log("file", message);
		callback(message)
	})
}