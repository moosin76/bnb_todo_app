import { socket } from 'boot/socket'

const sendMessage = (roomId, from, content) => {
	return new Promise((resolve, reject) => {
		socket.emit("chat:text", roomId, from, content, (data) => {
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
