const pwLib = require('../lib/pwLib');

const createRoom = async (form, user) => {

	const payload = {
		...form,
		userId: user.id
	}

	if (form.password) {
		payload.password = (await pwLib.createHashed(form.password, user.salt)).hashed;
	}

	const room = await $DB.rooms.create(payload);

	await $DB.chatUsers.create({
		roomId: room.id,
		userId: user.id
	});

	return room.id;
}

const getRoom = async (roomId, user) => {
	const room = await $DB.rooms.findByPk(roomId)
	return room;
}

const roomList = async(user)=>{
	const data = await $DB.chatUsers.findAll({
		attributes:['roomId'],
		where:{userId: user.id}
	})
	const rooms = data.map(room => room.roomId) 
	return rooms;
}

module.exports = {
	createRoom, getRoom,roomList
}