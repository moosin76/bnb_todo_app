<template>
  <q-chat-message
    v-if="message.type == 'text'"
    :name="user.nickName"
    :text="contents"
    :sent="message.from == sent"
    :stamp="stamp"
  />
</template>

<script>
import { defineComponent } from "vue";
import { date } from "quasar";

export default defineComponent({
  name: "MessageItem",
  props: {
    message: { type: Object, required: true },
    sent: { type: String, required: true },
    users: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    user() {
      // console.log(this.users);
      return this.users.find((user) => user.userId == this.message.from);
    },
    stamp() {
      return date.formatDate(this.message.createdAt, "A hh:mm");
    },
    contents() {
      // TODO: URL 링크
      // 여러줄 표시
      //

      return [this.message.content];
    },
  },
  mounted() {
    // console.log(this.user);
  },
});
</script>

<style lang='scss' scoped>
</style>
