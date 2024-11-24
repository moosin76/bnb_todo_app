import { api } from "src/boot/axios";
const URL = '/api/chat';

const createRoom = async (form) => {
  const { data } = await api.post(`${URL}/room`, form);
  return data;
}

const roomList = async (params) => {
  const { data } = await api.get(`${URL}/rooms`, { params });
  return data;
}

const addChatUser = async (roomId) => {
  const { data } = await api.post(`${URL}/user/${roomId}`);
  return data;
}

const getRoomMessages = async (roomId, offset, limit) => {
  const { data } = await api.get(`${URL}/messages/${roomId}`, {
    params: { offset, limit }
  })
  return data;
}

const roomAuth = async (roomId, password) => {
  const { data } = await api.post(`${URL}/room-auth/${roomId}`, { password });
  return data;
}

const changePassword = async (roomId, password) => {
  const { data } = await api.put(`${URL}/room/${roomId}/password`, { password });
  return data;
}

export default {
  createRoom, roomList,
  addChatUser,
  getRoomMessages,
  roomAuth,
  changePassword,
}
