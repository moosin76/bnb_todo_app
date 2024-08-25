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

export default {
	createRoom, roomList
}