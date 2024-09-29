<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 192px)"
      unit="px"
      :limits="[200, 300]"
    >
      <template #before>
        <RoomList @selected="selectedRoom" :cur-room="curRoom"></RoomList>
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
              <!-- <pre>{{ curRoom }}</pre> -->
              <MessageList
                ref="list"
                :room="curRoom"
                :my-id="user.id"
              ></MessageList>
              <MessageForm @message="sendMessage"></MessageForm>
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
import { mapActions, mapState } from "pinia";
import useChat from "src/stores/useChat";
import useUser from "src/stores/useUser";
import MessageForm from "src/components/chat/MessageForm.vue";
import socketApi from "src/apis/socketApi";
import MessageList from "src/components/chat/MessageList.vue";
import RoomList from "src/components/chat/RoomList.vue";
import UserList from "components/chat/UserList.vue";

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
    ...mapState(useUser, ["user"]),
    curRoom() {
      return this.rooms.find((room) => room.id == this.curRoomId);
    },
  },
  methods: {
    ...mapActions(useChat, ["addMessage"]),
    selectedRoom(roomId) {
      this.curRoomId = roomId;
    },
    async sendMessage(content) {
      // console.log(content);
      const message = await socketApi.sendMessage(
        this.curRoomId,
        this.user.id,
        content
      );
      // console.log("sendMessage callback", message);
      this.addMessage(message);
    },
  },
});
</script>

<style lang='scss' scoped>
</style>
