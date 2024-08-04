const io = $IO.of('/chat');

io.use((socket, next) => {
	const userId = socket.handshake.auth.userId;
	if (!userId) {
		return next(new Error("invalid userId"));
	}
	socket.userId = userId;
	next();
});

io.on("connection", (socket) => {
	console.log(socket.userId, socket.id);
	// fetch existing users

	socket.join(socket.userId); // 아이디로 방에 입장

	const users = [];
	for (let [id, socket] of io.sockets) {
		const find = users.find(u => u.userId == socket.userId);
		if (!find) {
			users.push({
				userId: socket.userId,
			});
		}
	}
	socket.emit("user:users", users);

	// notify existing users
	socket.broadcast.emit("user:connected", {
		userId: socket.userId,
	});

	// forward the private message to the right recipient
	socket.on("message:private", (to, from, content, callback) => {
		// TODO: DB 저장할꺼고
		const row = {
			from,
			content,
		};

		socket.to(to).emit("message:private", row);

		if (callback) {
			callback(row);
		}
	});

	// notify users upon disconnection
	socket.on("disconnect", () => {
		console.log("disconnect", socket.userId);
		socket.broadcast.emit("user:disconnected", socket.userId);
	});
});