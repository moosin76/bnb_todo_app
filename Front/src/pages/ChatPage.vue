<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 192px)"
      unit="px"
      :limits="[200, 300]"
    >
      <template #before>
        <RoomList></RoomList>
      </template>
      <template #after>
        <div
          v-if="selectedUser"
          class="full-height"
        >
          <MessageList :user="selectedUser" :me="me"></MessageList>
          <MessageForm
            :user="selectedUser"
            @message="sendMessage"
          ></MessageForm>
        </div>

        <div v-else>대화 상대를 선택하세요.!</div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "pinia";
import useChat from "src/stores/useChat";
import useUser from "src/stores/useUser";
import MessageForm from "src/components/chat/MessageForm.vue";
import socketApi from "src/apis/socketApi";
import MessageList from "src/components/chat/MessageList.vue";
import RoomList from "src/components/chat/RoomList.vue";

export default defineComponent({
  components: { RoomList, MessageForm, MessageList },
  name: "ChatPage",
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