import { boot } from 'quasar/wrappers'
import { io } from "socket.io-client";

const socket = io(process.env.CHAT_SOCKET, { transports: ['websocket'], autoConnect: false });

if (process.env.DEV) {
	socket.onAny((event, ...args) => {
		console.log(event, args);
	});
}

socket.on('user:users', (users) => {
	console.log('listen users', users)
})

socket.on('user:connected', (user) => {
	console.log('listen user connected', user)
})

socket.on('user:disconnected', userId => {
	console.log('listen user disconnected', userId)
})

export default boot(({ app }) => {
	app.config.globalProperties.$socket = socket;
})

export { socket };