<template>
  <q-dialog v-model="dialog" persistent>
		<q-card style="max-width: 700px; width: 100%;">
			<div class="row bg-grey-3 q-pa-md">
				<div class="text-h4">Rooms</div>
				<q-space></q-space>
				<q-btn @click="createRoom">create</q-btn>
				<q-btn icon="mdi-close" round flat @click="hide"></q-btn>
			</div>
			<q-card-section>방 목록을 가져오자</q-card-section>
		</q-card>
	</q-dialog>
	<RoomForm ref="roomForm" @created="selectRoom"></RoomForm>
</template>

<script>
import { defineComponent } from "vue";
import RoomForm from "components/chat/RoomForm.vue";

export default defineComponent({
	components:{RoomForm},
	emits:['selected'],
  name: "RoomSearch",
  data() {
    return {
      dialog: true,
    };
  },
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
		createRoom() {
			this.$refs.roomForm.show();
		},
		selectRoom(roomId) {
			console.log("select Room", roomId);
			this.$emit('selected', roomId);
			this.hide();
		}
  },
});
</script>

<style lang='scss' scoped>
</style>