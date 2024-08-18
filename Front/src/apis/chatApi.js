import { api } from "src/boot/axios";
const URL = '/api/chat';

const createRoom = async (form) => {
	const { data } = await api.post(`${URL}/room`, form);
	return data;
}

export default {
	createRoom,
}