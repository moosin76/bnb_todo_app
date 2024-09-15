import { socket } from 'boot/socket'

const sendMessage = (to, from, content) => {
	return new Promise((resolve, reject) => {
		socket.emit("message:private", to, from, content, (data) => {
			resolve(data)
		})
	})
}

const addRoom = (roomId) => {
  return new Promise((resolve, reject)=>{
    socket.emit('room:addRoom', roomId, (room)=>{
      resolve(room);
    })
  })
}

export default {
	sendMessage,
  addRoom,
}
