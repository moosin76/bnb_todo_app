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
        @click="selectRoom(room.id)"
      ></RoomItem>
    </q-list>

    <RoomSearch ref="roomSearch" @selected="addRoom"></RoomSearch>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import RoomSearch from "components/chat/RoomSearch.vue";
import { mapState } from "pinia";
import useChat from "src/stores/useChat";
import RoomItem from "components/chat/RoomItem.vue";

export default defineComponent({
  components: { RoomSearch, RoomItem },
  name: "RoomList",
	emits:['selected'],
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapState(useChat, ["rooms"]),
  },
  methods: {
    searchRooms() {
      this.$refs.roomSearch.show();
    },
    addRoom(roomId) {
      console.log("addRoom", roomId);
    },
		selectRoom(roomId) {
			this.$emit('selected', roomId)
		}
  },
});
</script>

<style lang='scss' scoped>
</style>