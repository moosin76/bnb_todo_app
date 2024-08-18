<template>
  <q-form @submit.stop="sendMessage" class="absolute-bottom">
    <div class="row">
      <q-input
        v-model="message"
        class="col-grow"
        square
        borderless
        bg-color="grey-2"
        input-class="q-px-sm"
        dense
      >
      </q-input>
      <q-btn
        type="submit"
        icon="mdi-send"
        unelevated
        dense
        color="green"
        square
      ></q-btn>
    </div>
  </q-form>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageForm",
  props: {
    user: { type: Object, required: true },
  },
  emits: ["message"],
  data() {
    return {
      message: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.$emit("message", this.message);
        this.message = "";
      }
    },
  },
});
</script>

<style lang='scss' scoped>
</style>