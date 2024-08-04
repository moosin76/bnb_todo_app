import { boot } from 'quasar/wrappers'
import { io } from "socket.io-client";
import useChat from 'src/stores/useChat';

const socket = io(process.env.CHAT_SOCKET, { transports: ['websocket'], autoConnect: false });

if (process.env.DEV) {
	socket.onAny((event, ...args) => {
		console.log(event, args);
	});
}

socket.on('user:users', (users) => {
	// console.log('listen users', users)
	const chatStore = useChat();
	chatStore.setUsers(users);
})

socket.on('user:connected', (user) => {
	// console.log('listen user connected', user)
	const chatStore = useChat();
	chatStore.userConnected(user);
})

socket.on('user:disconnected', userId => {
	// console.log('listen user disconnected', userId)
	const chatStore = useChat();
	chatStore.userDisconnected(userId);
})

export default boot(({ app }) => {
	app.config.globalProperties.$socket = socket;
})

export { socket };