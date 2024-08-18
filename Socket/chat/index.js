const io = $IO.of('/chat');

io.use((socket, next) => {
	const userId = socket.handshake.auth.userId;
	if (!userId) {
		return next(new Error("invalid userId"));
	}
	socket.userId = userId;
	next();
});

const getRoomIds = async (userId) => {
	const data = await $DB.chatUsers.findAll({
		attributes: ['roomId'],
		where: { userId }
	})
	const rooms = data.map(room => room.roomId)
	return rooms;
}

const joinChatRoom = async (socket, roomId) => {
	socket.join(`room-${roomId}`);
	const room = await $DB.rooms.findOne({
		where: { id: roomId },
		include: {
			model: $DB.chatUsers,
			as: 'users',
		}
		/* [
			// { model: $DB.chatMessages, where: { roomId } },
			{ model: $DB.chatUsers }
		]
			*/
	})
	// console.log(room);
	return room;
}

io.on("connection", async (socket) => {
	console.log(socket.userId, socket.id);
	// fetch existing users

	await $DB.user.update({ connected: true }, { where: { id: socket.userId } })

	socket.join(socket.userId); // 아이디로 방에 입장
	// TODO: 내가 입장할 방 목록 가져오고 방에 입장
	const roomIds = await getRoomIds(socket.userId);
	console.log('roomIds', roomIds);
	// TODO: 방 목록을 반환 <-
	const rooms = [];
	for (const roomId of roomIds) {
		const room = await joinChatRoom(socket, roomId);
		rooms.push(room.toJSON());
	}


	console.log('rooms', rooms);

	// TODO: 방 목록에 내가 접속했음을 알린다.

	// forward the private message to the right recipient
	socket.on("message:private", async (to, from, content, callback) => {
		console.log("m,s", to, from);
		// TODO: DB 저장할꺼고
		const row = await $DB.chatMessages.create({
			to,
			from,
			content,
			userId: socket.userId
		})

		console.log(row);

		// const row = {
		// 	from,
		// 	content,
		// };

		socket.to(to).emit("message:private", row);

		if (callback) {
			callback(row);
		}
	});

	// notify users upon disconnection
	socket.on("disconnect", async () => {
		const matchingSockets = await io.in(socket.userId).allSockets();
		const isDisconnected = matchingSockets.size == 0;
		if (isDisconnected) {
			console.log("disconnect", socket.userId);
			// TODO: 내가 입장한 방의 사용자들에게 내가 연결이 종료됬음을 알림

			await $DB.user.update({ connected: false }, { where: { id: socket.userId } });
		}

	});
});