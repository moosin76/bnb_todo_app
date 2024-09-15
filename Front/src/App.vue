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
    });
  },
});
</script>
