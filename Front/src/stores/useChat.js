import { defineStore } from 'pinia';
import useUser from 'stores/useUser';

const initReactiveProperties = (user) => {
	user.connected = true;
	user.messages = [];
	user.hasNewMessages = false;
};

export default defineStore('useChat', {
	state: () => ({
		users: [],
	}),
	getters: {
	},
	actions: {
		setUsers(users) {
			const userStore = useUser();
			users.forEach(user => {
				user.self = user.userId == userStore.user.id;
				initReactiveProperties(user);
			})
			this.users = users.sort((a, b) => {
				return a.self ? -1 : 1;
			})
		},
		userConnected(user) {
			console.log('userConnected', user)
			const find = this.users.find(u => u.userId == user.userId);
			if (find) {
				find.connected = true;
			} else {
				initReactiveProperties(user);
				this.users.push(user)
			}
		},
		userDisconnected(userId) {
			console.log('userDiconnected', userId);
			const find = this.users.find(user => user.userId == userId);
			if (find) {
				find.connected = false;
			}
		},
		addMessage({to, from, content}) {
			const find = this.users.find(u=>u.userId == from);
			if(find) {
				find.messages.push({to, from, content});
			}
		}
	},
});