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
	const users = [];
	for (let [id, socket] of io.sockets) {
		users.push({
			userId: socket.userId,
		});
	}
	socket.emit("user:users", users);

	// notify existing users
	socket.broadcast.emit("user:connected", {
		userId: socket.userId,
	});

	// forward the private message to the right recipient
	socket.on("message:private", ({ content, to }) => {
		socket.to(to).emit("message:private", {
			content,
			from: socket.id,
		});
	});

	// notify users upon disconnection
	socket.on("disconnect", () => {
		console.log("disconnect", socket.userId);
		socket.broadcast.emit("user:disconnected", socket.userId);
	});
});