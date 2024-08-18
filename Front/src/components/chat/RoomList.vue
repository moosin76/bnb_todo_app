<template>
  <div>
    <q-input label="search" v-model="search" dense>
      <template #append>
        <q-btn icon="mdi-plus" round dense flat @click="searchRooms"></q-btn>
      </template>
    </q-input>
		<RoomSearch ref="roomSearch" @selected="addRoom"></RoomSearch>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import RoomSearch from "components/chat/RoomSearch.vue";

export default defineComponent({
  components: { RoomSearch },
  name: "RoomList",
  data() {
    return {
      search: "",
    };
  },
  methods: {
    searchRooms() {
			this.$refs.roomSearch.show();
		},
		addRoom(roomId) {
			console.log('addRoom', roomId);
		}
  },
});
</script>

<style lang='scss' scoped>
</style>