<template>
  <q-list>
    <q-item
      v-for="(user, idx) in users"
      clickable
      @click="emitValue(user)"
			:active="modelValue && modelValue.userId == user.userId"
			active-class="bg-blue-1"
    >
      <q-item-section avatar>
        <q-icon
          name="mdi-circle"
          :color="user.connected ? 'green' : 'grey-5'"
        ></q-icon>
      </q-item-section>
      <q-item-section>
        {{ user.userId }}
        {{ user.self ? "(yourself)" : "" }}
      </q-item-section>
      <q-item-section side>
        <q-icon
          v-if="user.hasNewMessage"
          name="mdi-chat-alert"
          color="primary"
        ></q-icon>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserList",
  props: {
    modelValue: { type: [Object, null], required: true },
    users: { type: Array, required: true },
  },
  data() {
    return {};
  },
	methods:{
		emitValue(user) {
			this.$emit('update:model-value', user)
		}
	}
});
</script>

<style lang='scss' scoped>
</style>