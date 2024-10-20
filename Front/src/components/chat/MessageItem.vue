<template>
  <q-chat-message
    v-if="message.type == 'text'"
    :name="user.nickName"
    :sent="message.from == sent"
    :stamp="stamp"
  >
    <div v-html="contents.text"></div>
    <div v-if="contents.link.length > 0" class="q-gutter-y-sm">
      <q-btn
        v-for="url in contents.link"
        :key="url"
        :href="url"
        target="_blank"
        style="display: block; max-width: 408px"
      >
        <div class="ellipsis">{{ url }}</div>
      </q-btn>
    </div>
  </q-chat-message>
  <q-chat-message
    v-if="message.type == 'image'"
    :name="user.nickName"
    :sent="message.from == sent"
    :stamp="stamp"
  >
    <!-- <div>{{ message.id }}</div>
    <div>{{ contents.name }}</div>
    <div>{{ contents.size }}</div>
    <div>{{ contents.type }}</div>
    <div>{{ contents.path }}</div>
    <div>{{ API_SERVER }}</div> -->
    <div><img :src="contents.thumb" style="max-height: 200px" /></div>
    <div>
      <q-btn
        icon="mdi-file-download"
        target="_blank"
        :href="contents.url"
        download
      >
        {{ contents.humanSize }} {{ contents.name }}
      </q-btn>
    </div>
  </q-chat-message>
  <q-chat-message
    v-if="message.type == 'file'"
    :name="user.nickName"
    :sent="message.from == sent"
    :stamp="stamp"
  >
    <!-- <div>{{ message.id }}</div>
    <div>{{ contents.name }}</div>
    <div>{{ contents.size }}</div>
    <div>{{ contents.humanSize }}</div>
    <div>{{ contents.type }}</div>
    <div>{{ contents.path }}</div>
    <div>{{ API_SERVER }}</div> -->
    <div>
      <q-btn
        icon="mdi-file-download"
        target="_blank"
        :href="contents.url"
        download
      >
        {{ contents.humanSize }} {{ contents.name }}
      </q-btn>
    </div>
  </q-chat-message>
</template>

<script>
import { defineComponent } from "vue";
import { date, Cookies, format } from "quasar";

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
          let link = this.getLink(this.message.content);
          let text = this.getIcon(this.message.content);
          text = this.getGifImage(text);
          text = text.replaceAll(/\n/g, "<br/>"); // 개행처리
          return {
            text,
            link,
          };
        case "image": {
          const token = Cookies.get("token");
          const obj = JSON.parse(this.message.content);
          obj.url = `${process.env.API}/api/chat/file/${this.message.id}/${obj.name}?token=${token}`;
          obj.thumb = `${process.env.API}/api/chat/file/${this.message.id}/${obj.name}?h=200&token=${token}`;
          obj.humanSize = format.humanStorageSize(obj.size);
          return obj;
        }
        case "file": {
          const token = Cookies.get("token");
          const obj = JSON.parse(this.message.content);
          obj.url = `${process.env.API}/api/chat/file/${this.message.id}/${obj.name}?token=${token}`;
          obj.humanSize = format.humanStorageSize(obj.size);
          return obj;
        }
      }
    },
  },
  methods: {
    getLink(message) {
      const pattern = /https?:\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?/g;
      const matches = message.match(pattern) || [];
      return matches;
    },
    getIcon(message) {
      const pattern = /\[icon:([^\]]+)\]/g;
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach((value) => {
          const iconMatch = value.match(/\[icon:([^\]]+)\]/);
          message = message.replace(
            value,
            `<span class="mdi mdi-${iconMatch[1]}"></span>`
          );
        });
      }
      return message;
    },
    getGifImage(message) {
      const pattern = /\[img:([^\]]+)\]/g;
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach((value) => {
          const iconMatch = value.match(/\[img:([^\]]+)\]/);
          message = message.replace(
            value,
            `<img src="/images/${iconMatch[1]}" style="height:40px; width:auto">`
          );
        });
      }
      return message;
    },
  },
  mounted() {
    // console.log(this.user);
  },
});
</script>

<style lang='scss' scoped>
</style>
