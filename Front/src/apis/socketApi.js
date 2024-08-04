import { socket } from 'boot/socket'

const sendMessage = (to, from, content) => {
	return new Promise((resolve, reject) => {
		socket.emit("message:private", to, from, content, (data) => {
			resolve(data)
		})
	})
}

export default {
	sendMessage,
}