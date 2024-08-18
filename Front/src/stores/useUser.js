import { defineStore } from 'pinia';
// import userApi from 'src/apis/userApi';
import { socket } from 'src/boot/socket';

export default defineStore('useUser', {
	state: () => ({
		user: null,
	}),
	getters: {
		isLogin() {
			return !!this.user;
		}
	},
	actions: {
		login(user) {
			this.user = user;
			socket.auth = { userId: user.id };
			socket.connect();
		},
		logout() {
			this.user = null;
			socket.disconnect();
		}
	},
});