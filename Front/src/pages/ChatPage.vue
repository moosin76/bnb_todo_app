<template>
	<div>ChatPage</div>
</template>

<script>
import { defineComponent } from 'vue'
import { socket } from 'src/boot/socket';
import useSocketListner from 'src/composables/useSocketListner';

export default defineComponent({
	name: 'ChatPage',
	setup() {
		useSocketListner(socket, {
			"connect":(userId) =>{
				console.log("connect userID", userId)
			},
			"disconnect":() =>{

			},
			"sendmessage":()=>{

			}
		})
	},
	data() {
		return {}
	},
});
</script>

<style lang='scss' scoped>
</style>