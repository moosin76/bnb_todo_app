<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 192px)"
      unit="px"
      :limits="[200, 300]"
    >
      <template #before>
        <RoomList @selected="selectedRoom"></RoomList>
      </template>
      <template #after>
        <q-splitter
          v-model="splitterModel2"
          style="height: calc(100vh - 192px)"
          unit="px"
          :limits="[50, 200]"
          reverse
        >
          <template #before>
            <div v-if="curRoom" class="full-height">
							<pre>{{ curRoom }}</pre>
            </div>
            <div v-else>대화방을 선택하세요!</div>
          </template>
          <template #after>
            <UserList v-if="curRoom" :users="curRoom.users"></UserList>
          </template>
        </q-splitter>
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
import UserList from 'components/chat/UserList.vue'

export default defineComponent({
  components: { RoomList, MessageForm, MessageList, UserList },
  name: "ChatPage",
  data() {
    return {
      splitterModel: 300,
      splitterModel2: 200,
      curRoomId: "",
    };
  },
  computed: {
    ...mapState(useChat, ["rooms"]),
    curRoom() {
      return this.rooms.find((room) => room.id == this.curRoomId);
    },
  },
  methods: {
    selectedRoom(roomId) {
      this.curRoomId = roomId;
    },
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