<template>
  <q-chat-message
    v-if="message.type == 'text'"
    :name="user.nickName"
    :text="contents"
    :sent="message.from == sent"
    :stamp="stamp"
  />
  <q-chat-message
    v-if="message.type == 'image'"
    :name="user.nickName"
    :sent="message.from == sent"
    :stamp="stamp"
  >
    <div>{{ message.id }}</div>
    <div>{{ contents.name }}</div>
    <div>{{ contents.size }}</div>
    <div>{{ contents.type }}</div>
    <div>{{ contents.path }}</div>
    <div>{{API_SERVER}}</div>
    <div><img :src="contents.url"/></div>
  </q-chat-message>
</template>

<script>
import { defineComponent } from "vue";
import { date, Cookies } from "quasar";

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
    API_SERVER() {
      return process.env.API;
    },
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
      switch (this.message.type) {
        case "text":
          return [this.message.content];
        case "image":
        case "file":
          const token = Cookies.get('token');
          const obj = JSON.parse(this.message.content);
          obj.url = `${process.env.API}/api/chat/file/${this.message.id}/${obj.name}?token=${token}`;
          return obj;
      }
    },
  },
  mounted() {
    // console.log(this.user);
  },
});
</script>

<style lang='scss' scoped>
</style>
