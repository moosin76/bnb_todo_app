import { defineStore } from 'pinia';
import useUser from 'stores/useUser';

export default defineStore('useChat', {
	state: () => ({
		rooms: [
			// {id, name:"", messages:[], users:[]}
		],
	}),
	getters: {
	},
	actions: {
		async joinRoom(roomId) {
			
		}
	},
});