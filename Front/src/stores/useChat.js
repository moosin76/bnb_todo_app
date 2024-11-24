import { defineStore } from 'pinia';
import useUser from 'stores/useUser';
import { Notify } from 'quasar'

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
      const room = this.rooms.find(room => room.id == roomId);
      if (room) {
        room.users.push(user);
      }
    },
    addMessage(message) {
      const room = this.rooms.find(room => room.id == message.roomId);
      if (room) {
        room.messages.unshift(message);
        room.messagesCount++;
      }
    },
    pushMessages(roomId, { rows, count }) {
      const room = this.rooms.find(room => room.id == roomId);
      if (room) {
        room.messages = [...room.messages, ...rows];
        room.messagesCount = count;
      }
    },
    userConnect(roomId, userId, connected) {
      const room = this.rooms.find(room => room.id == roomId);
      if (room) {
        const user = room.users.find(u => u.userId == userId);
        if (user) {
          user.connected = connected;
        }
      }
    },
    userLeave(roomId, userId) {
      const room = this.rooms.find(room => room.id == roomId);
      if (room) {
        const user = room.users.find(u => u.userId == userId);
        if (user) {
          const idx = room.users.indexOf(user);
          room.users.splice(idx, 1);
        }
      }
    },
    roomLeave(roomId) {
      const room = this.rooms.find(room => room.id == roomId);
      if (room) {
        const idx = this.rooms.indexOf(room);
        this.rooms.splice(idx, 1);
      }
    },
    userRoleChange(roomId, userId, role) {
      const room = this.rooms.find(room => room.id == roomId);
      if (room) {
        const user = room.users.find(u => u.userId == userId);
        if (user) {
          user.role = role;
          const userStore = useUser();
          if (userStore.user.id == user.userId) {
            if (role == 'Block') { // 차단이니깐 방목에서 방 목록 자체 업어야되요
              this.roomLeave(room.id);
              if (userStore.user.id == user.userId) {
                Notify.create({ type: 'negative', message: `${room.name} 방에서 추방되었습니다.` })
              }
            } else {
              if (userStore.user.id == user.userId) {
                Notify.create({ type: 'info', message: `${room.name} 방의 역활이 ${role}로 변경되었습니다.` })
              }
            }
          }
        }
      }
    }
  },
});
