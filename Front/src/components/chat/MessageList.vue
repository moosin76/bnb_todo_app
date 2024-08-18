<template>
  <q-scroll-area style="height: calc(100% - 40px); padding: 0 16px;">
    <q-chat-message
      v-for="(message, idx) in messages"
      :key="idx"
      :name="message.from"
      :text="[message.content]"
      :sent="message.from == me.id"
    />
  </q-scroll-area>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageList",
  props: {
    user: { type: Object, required: true },
    me: { type: Object, required: true },
  },
  data() {
    return {};
  },
  computed: {
    messages() {
      return this.user.messages;
    },
  },
});
</script>

<style lang='scss' scoped>
</style>