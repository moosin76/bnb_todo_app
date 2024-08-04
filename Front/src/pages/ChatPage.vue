<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 192px)"
      unit="px"
      :limits="[200, 300]"
    >
      <template #before>
        <UserList v-model="selectedUser" :users="users"></UserList>
      </template>
      <template #after>
        <MessageForm
          v-if="selectedUser"
          :user="selectedUser"
          @message="sendMessage"
        ></MessageForm>
        <div v-else>대화 상대를 선택하세요.!</div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { socket } from "src/boot/socket";
import useSocketListner from "src/composables/useSocketListner";
import UserList from "src/components/chat/UserList.vue";
import { mapState } from "pinia";
import useChat from "src/stores/useChat";
import useUser from "src/stores/useUser";
import MessageForm from "src/components/chat/MessageForm.vue";
import socketApi from "src/apis/socketApi";

export default defineComponent({
  components: { UserList, MessageForm },
  name: "ChatPage",
  setup() {
    useSocketListner(socket, {
      "message:private": (data) => {
        const chatStore = useChat();
				chatStore.addMessage(data);
      },
    });
  },
  data() {
    return {
      splitterModel: 300,
      selectedUser: null,
    };
  },
  computed: {
    ...mapState(useChat, ["users"]),
    ...mapState(useUser, { me: "user" }),
  },
  methods: {
    async sendMessage(content) {
      const data = await socketApi.sendMessage(
        this.selectedUser.userId,
        this.me.id,
        content
      );
      console.log("sendMessage callback", data);
      this.selectedUser.messages.push(data);
    },
  },
});
</script>

<style lang='scss' scoped>
</style>