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
    async newRoom(room) {
      this.rooms.push(room);
      console.log('newRoom', this.rooms);
    },
		async joinUser(roomId, user) {
      const room = this.rooms.find(room=> room.id == roomId);
      if(room) {
        room.users.push(user);
      }
		}
	},
});
