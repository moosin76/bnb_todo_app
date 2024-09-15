<template>
  <div>
    <q-input label="search" v-model="search" dense>
      <template #append>
        <q-btn icon="mdi-plus" round dense flat @click="searchRooms"></q-btn>
      </template>
    </q-input>
    <q-list separator>
      <RoomItem
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        clickable
        active-class="bg-blue-3"
        :active="room == curRoom"
        @click="selectRoom(room.id)"
      ></RoomItem>
    </q-list>

    <RoomSearch ref="roomSearch" @selected="addRoom"></RoomSearch>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import RoomSearch from "components/chat/RoomSearch.vue";
import { mapActions, mapState } from "pinia";
import useChat from "src/stores/useChat";
import RoomItem from "components/chat/RoomItem.vue";
import socketApi from "src/apis/socketApi";

export default defineComponent({
  components: { RoomSearch, RoomItem },
  name: "RoomList",
  props: {
    curRoom: { type: [Object, null], default: null },
  },
  emits: ["selected"],
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapState(useChat, ["rooms"]),
  },
  methods: {
    ...mapActions(useChat, ["newRoom"]),
    searchRooms() {
      this.$refs.roomSearch.show();
    },
    async addRoom(roomId) {
      console.log("addRoom", roomId);
      // 소켓 서버에서 룸 아이디로 룸정보를 가져와서
      const room = await socketApi.addRoom(roomId);
      console.log("addRoom", room);
      // 내 useChat.rooms 에 넣자.
      this.newRoom(room);
    },
    selectRoom(roomId) {
      this.$emit("selected", roomId);
    },
  },
});
</script>

<style lang='scss' scoped>

</style>
