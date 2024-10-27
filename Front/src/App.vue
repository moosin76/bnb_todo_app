<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { socket } from "boot/socket";
import useSocketListner from "src/composables/useSocketListner";
import useChat from "src/stores/useChat";

export default defineComponent({
  name: "App",
  setup() {
    const chatStore = useChat();
    useSocketListner(socket, {
      "room:init": (rooms) => {
        chatStore.initRooms(rooms);
      },
      "room:joinUser": (roomId, user) => {
        chatStore.joinUser(roomId, user);
      },
      "chat:message": (message) => {
        chatStore.addMessage(message);
      },
      "room:connect": (roomId, userId, connected) => { // 유저의 접속여부
        chatStore.userConnect(roomId, userId, connected);
      },
      "room:leave": (roomId, userId) => { // 방 나가기
        chatStore.userLeave(roomId, userId);
      },
    });
  },
});
</script>
