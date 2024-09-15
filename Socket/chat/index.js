const io = $IO.of('/chat');
const { getRoomIds, joinChatRoom } = require('./lib/func');
const roomHandler = require('./handlers/roomHandler');

io.use((socket, next) => {
	const userId = socket.handshake.auth.userId;
	if (!userId) {
		return next(new Error("invalid userId"));
	}
	socket.userId = userId;
	next();
});

io.on("connection", async (socket) => {
	// 핸들러 등록
	roomHandler(io, socket);
	
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
		rooms.push(room);
	}
	// console.log('rooms', rooms);
	socket.emit('room:init', rooms);


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