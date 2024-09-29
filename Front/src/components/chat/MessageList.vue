<template>
  <q-scroll-area
    ref="scroller"
    class="q-pa-md"
    style="height: calc(100% - 40px)"
  >
    <q-infinite-scroll ref="area" @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :sent="myId"
        :users="room.users"
      />
    </q-infinite-scroll>
  </q-scroll-area>
</template>

<script>
import { defineComponent } from "vue";
import MessageItem from "components/chat/MessageItem.vue";
import chatApi from "src/apis/chatApi";
import { mapActions } from "pinia";
import useChat from "src/stores/useChat";

export default defineComponent({
  // TODO: Infinite Scroll 컴포넌트 써보자
  components: { MessageItem },
  name: "MessageList",
  props: {
    room: { type: Object, required: true },
    myId: { type: String, required: true },
  },
  data() {
    return {
      useScroll: true,
    };
  },
  computed: {
    messages() {
      return [...this.room.messages].reverse();
    },
  },
  watch: {
    room() {
      this.$refs.area.resume();
    },
    messages() {
      if (this.useScroll) {
        setTimeout(() => {
          this.scrollBottom();
        }, 250);
      }
    },
  },
  methods: {
    ...mapActions(useChat, ["pushMessages"]),
    async onLoad(index, done) {
      // console.log("onLoad", this.room);
      if (
        this.room.messagesCount != 0 &&
        this.room.messages.length == this.room.messagesCount
      ) {
        this.$refs.area.stop();
        setTimeout(() => {
          const scr = this.$refs.scroller.getScroll();
          this.$refs.scroller.setScrollPosition(
            "vertical",
            scr.verticalSize - scr.verticalContainerSize + 40,
            0
          );
        }, 250);

        return;
      }
      this.useScroll = false;
      const offset = this.room.messages.length;
      const limit = 10;
      const roomId = this.room.id;
      const data = await chatApi.getRoomMessages(roomId, offset, limit);
      console.log(data);
      this.pushMessages(roomId, data);
      if (this.room.messages.length == this.room.messagesCount) {
        this.$refs.area.stop();
      } else {
        done();
      }
      await this.$nextTick();
      this.useScroll = true;
    },
    scrollBottom() {
      const scr = this.$refs.scroller.getScroll();
      if (scr.verticalPercentage > 0.8) {
        this.$refs.scroller.setScrollPosition(
          "vertical",
          scr.verticalSize - scr.verticalContainerSize + 40,
          400
        );
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>
