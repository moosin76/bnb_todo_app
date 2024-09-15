<template>
  <q-scroll-area style="height: calc(100% - 40px); padding: 0 16px">
    <MessageItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :sent="myId"
      :users="room.users"
    />
  </q-scroll-area>
</template>

<script>
import { defineComponent } from "vue";
import MessageItem from "components/chat/MessageItem.vue";

export default defineComponent({
  // TODO: Infinite Scroll 컴포넌트 써보자
  components: { MessageItem },
  name: "MessageList",
  props: {
    room: { type: Object, required: true },
    myId: { type: String, required: true },
  },
  data() {
    return {};
  },
  computed: {
    messages() {
      return this.room.messages;
    },
  },

});
</script>

<style lang='scss' scoped>
</style>
