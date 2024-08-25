<template>
  <q-list separator>
    <UserItem 
			v-for="user in users" 
			:key="user.userId" 
			:user="user">
		</UserItem>
  </q-list>
</template>

<script>
import { defineComponent } from "vue";
import UserItem from "components/chat/UserItem.vue";

export default defineComponent({
  components: { UserItem },
  name: "UserList",
  props: {
    users: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
});
</script>

<style lang='scss' scoped>
</style>