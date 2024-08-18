require('dotenv').config();

const httpServer = require("http").createServer();

// DB
const ConnectSequelize = require('./lib/ConnectSequelize')
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE } = process.env;
ConnectSequelize(__dirname + '/models', DB_HOST, DB_USER, DB_PASS, DB_DATABASE, DB_PORT, console.log).then(db => {
	global.$DB = db;
	
	const io = require("socket.io")(httpServer, {
		cors: {
			origin: "http://todo.bnb.com:5080",
		},
	});
	
	global.$IO = io;
	require('./chat');
	
	const PORT = process.env.PORT || 3000;
	
	httpServer.listen(PORT, () =>
		console.log(`server listening at http://sockek.bnb.com:${PORT}`)
	);

})


