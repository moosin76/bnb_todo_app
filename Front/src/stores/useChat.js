import { defineStore } from 'pinia';
import useUser from 'stores/useUser';

export default defineStore('useChat', {
	state: () => ({
		rooms: [],
	}),
	getters: {
	},
	actions: {
		async initRooms(rooms) {
			this.rooms = rooms;
		},
		async joinRoom(roomId) {
			
		}
	},
});