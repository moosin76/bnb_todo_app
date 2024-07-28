import { defineStore } from 'pinia';
import userApi from 'src/apis/userApi';

export default defineStore('useUser', {
	state: ()=>({
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
		},
		logout() {
			this.user = null;
		}
	},
});