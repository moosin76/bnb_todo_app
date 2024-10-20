import { socket } from 'boot/socket'
import { api } from 'boot/axios';

const sendMessage = (roomId, from, content) => {
  return new Promise((resolve, reject) => {
    socket.emit("chat:text", roomId, from, content, (data) => {
      resolve(data)
    })
  })
}

const sendFile = async (roomId, from, file) => {

  // 백엔드 파일을 저장하고 경로를 받아서
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/chat/file', formData); //  파일 업로드 하고 저장된 파일명

  const fileInfo = {
    name: file.name, // 원래 파일명
    size: file.size,
    type: file.type,
    path: data, // 저장된 파일명
  }
  return new Promise((resolve, reject) => {
    socket.emit("chat:file", roomId, from, fileInfo, (response) => {
      // console.log("res", response);
      resolve(response)
    })
  })
}

const addRoom = (roomId) => {
  return new Promise((resolve, reject) => {
    socket.emit('room:addRoom', roomId, (room) => {
      resolve(room);
    })
  })
}

export default {
  sendMessage, sendFile,
  addRoom,
}
