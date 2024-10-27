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
              <MessageForm
                @message="sendMessage"
                @upload="sendFile"
              ></MessageForm>
            </div>
            <div v-else>대화방을 선택하세요!</div>
          </template>
          <template #after>
            <div
              v-if="curRoom"
              class="full-height"
              style="padding-bottom: 40px; position: relative"
            >
              <UserList :users="curRoom.users"></UserList>
              <q-btn
                label="방 나가기"
                unelevated
                square
                class="full-width absolute-bottom"
                color="red"
                style="height: 40px"
                @click="leaveRoom"
              ></q-btn>
            </div>
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
    ...mapActions(useChat, ["addMessage", "roomLeave"]),
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
    sendFile(file) {
      this.$q
        .dialog({
          message: `${file.name} 업로드 하시겠습니까?`,
          cancel: true,
        })
        .onOk(async () => {
          const message = await socketApi.sendFile(
            this.curRoomId,
            this.user.id,
            file
          );
          // console.log("add file", message);
          this.addMessage(message);
        });
    },
    leaveRoom() {
      // 소켓에 룸ID로 나가는거로 하고
      const roomName = this.curRoom.name;
      this.$q
        .dialog({
          title: "방 나가기",
          message: `[${roomName}] 방을 나가시겠습니까?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          this.$q.loading.show();
          const data = await socketApi.leaveRoom(this.curRoom.id);
          if (data) {
            this.roomLeave(this.curRoom.id);
            this.$q.notify({
              type: "info",
              message: `${roomName}을 나갔습니다.`,
            });
            this.curRoom = null;
          } else {
            this.$q.notify({
              type: "negative",
              message: "방에서 나가기 오류!",
            });
          }
          this.$q.loading.hide();
        });
    },
  },
});
</script>

<style lang='scss' scoped>
</style>
